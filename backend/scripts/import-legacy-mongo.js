#!/usr/bin/env node
'use strict';

/**
 * One-off importer: legacy MongoDB problems/ideas (the old backend that still
 * serves www.vjstartup.com) -> the shared Postgres schema this backend uses.
 *
 * Input is JSON: a mongoexport dump (JSON array or one document per line), or
 * the public list API saved to a file. Extended-JSON wrappers ({"$oid"},
 * {"$date"}, {"$numberInt"}) are unwrapped.
 *
 *   node scripts/import-legacy-mongo.js --problems problems.json --ideas ideas.json --dry-run
 *   node scripts/import-legacy-mongo.js --problems problems.json --ideas ideas.json
 *
 * Safe to re-run: records are upserted on their legacy problemId / ideaId, and
 * child rows (upvotes, comments, ...) are de-duplicated. Nothing is deleted
 * except the lists it re-creates for an idea that the source actually has.
 *
 * Problems are imported before ideas so an idea's relatedProblemId resolves.
 * Every person a record references must already exist in `users` (the table is
 * owned by Django - create people first with `migrate_mongo_users` or the
 * public-auth upsert); records whose author is missing are skipped and listed.
 */

const fs = require('fs');
const prisma = require('../config/prisma');

// ─── argument parsing ───────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { dryRun: false, problems: null, ideas: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') args.dryRun = true;
    else if (argv[i] === '--problems') args.problems = argv[++i];
    else if (argv[i] === '--ideas') args.ideas = argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!args.problems && !args.ideas) {
    throw new Error('Nothing to do: pass --problems <file> and/or --ideas <file> (add --dry-run to preview).');
  }
  return args;
}

// ─── value helpers (tolerant of Mongo extended JSON) ────────────────────────

function unwrap(v) {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    if ('$oid' in v) return v.$oid;
    if ('$numberInt' in v) return Number(v.$numberInt);
    if ('$numberLong' in v) return Number(v.$numberLong);
    if ('$numberDouble' in v) return Number(v.$numberDouble);
    if ('$date' in v) return unwrap(v.$date);
  }
  return v;
}

function str(v) {
  v = unwrap(v);
  return v === undefined || v === null || v === '' ? null : String(v);
}

function text(v, fallback = '') {
  return str(v) ?? fallback;
}

function toDate(v) {
  v = unwrap(v);
  if (v === undefined || v === null || v === '') return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function toInt(v, fallback = 0) {
  v = unwrap(v);
  if (Array.isArray(v)) return v.length;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function toBool(v) {
  return unwrap(v) === true || unwrap(v) === 'true';
}

function emailOf(v) {
  v = unwrap(v);
  if (v && typeof v === 'object') v = v.email ?? v.userEmail;
  return typeof v === 'string' ? v.trim().toLowerCase() : '';
}

function emailList(v) {
  return [...new Set((Array.isArray(v) ? v : []).map(emailOf).filter(Boolean))];
}

function tagList(v) {
  return (Array.isArray(v) ? v : []).map((t) => str(t)).filter(Boolean);
}

function accessLevel(v) {
  return (str(v) || 'PUBLIC').toUpperCase() === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC';
}

function readRecords(file, listKeys) {
  const raw = fs.readFileSync(file, 'utf8').replace(/^﻿/, '').trim();
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (_) {
    parsed = raw
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l));
  }
  if (Array.isArray(parsed)) return parsed;
  for (const key of listKeys) if (Array.isArray(parsed && parsed[key])) return parsed[key];
  throw new Error(`${file}: expected a JSON array (or an object with one of: ${listKeys.join(', ')})`);
}

// ─── mapping: legacy document -> Prisma rows ────────────────────────────────

const PROBLEM_KNOWN = new Set([
  '_id', '__v', 'problemId', 'title', 'briefparagraph', 'description', 'marketSize', 'existingSolutions',
  'currentGaps', 'targetCustomers', 'image', 'upvotes', 'background', 'scalability', 'addedByName',
  'addedByEmail', 'tags', 'verified', 'verifiedBy', 'verifiedAt', 'verificationNotes', 'createdAt',
  'updatedAt', 'collaborators', 'upvotedBy', 'comments',
]);

const IDEA_KNOWN = new Set([
  '_id', '__v', 'ideaId', 'title', 'description', 'titleImage', 'relatedProblemId', 'stage', 'upvotes',
  'mentor', 'contact', 'addedByName', 'addedByEmail', 'tags', 'targetCustomers', 'verified', 'verifiedBy',
  'verifiedAt', 'verificationNotes', 'createdAt', 'updatedAt', 'isStartupWorthy', 'worthinessLevel',
  'evaluatedAt', 'hasStartupCreated', 'collaborators', 'teamMembers', 'team', 'startupStatus', 'upvotedBy',
  'comments', 'attachments', 'links',
]);

function mapReplies(list, keyPrefix) {
  return (Array.isArray(list) ? list : []).map((r, i) => ({
    replyId: str(r.replyId ?? r.id ?? r._id) || `${keyPrefix}-r${i}`,
    text: text(r.text ?? r.content ?? r.comment),
    name: text(r.name ?? r.author ?? r.userName, 'Unknown'),
    email: emailOf(r.email ?? r.userEmail),
    likes: toInt(r.likes),
    likedBy: emailList(r.likedBy ?? (Array.isArray(r.likes) ? r.likes : [])),
    createdAt: toDate(r.createdAt ?? r.date),
  }));
}

function mapComments(list, keyPrefix) {
  return (Array.isArray(list) ? list : []).map((c, i) => {
    const key = `${keyPrefix}-c${i}`;
    return {
      commentId: str(c.commentId ?? c.id ?? c._id) || key,
      text: text(c.text ?? c.content ?? c.comment),
      name: text(c.name ?? c.author ?? c.userName, 'Unknown'),
      email: emailOf(c.email ?? c.userEmail),
      likes: toInt(c.likes),
      likedBy: emailList(c.likedBy ?? (Array.isArray(c.likes) ? c.likes : [])),
      createdAt: toDate(c.createdAt ?? c.date),
      replies: mapReplies(c.replies, key),
    };
  });
}

function verificationFields(doc) {
  return {
    verified: toBool(doc.verified),
    verifiedBy: str(doc.verifiedBy),
    verifiedAt: toDate(doc.verifiedAt) ?? null,
    verificationNotes: str(doc.verificationNotes),
  };
}

function mapProblem(doc) {
  const problemId = str(doc.problemId) || str(doc._id);
  const upvotedBy = emailList(doc.upvotedBy);
  return {
    problemId,
    unknownKeys: Object.keys(doc).filter((k) => !PROBLEM_KNOWN.has(k)),
    data: {
      problemId,
      title: text(doc.title),
      briefparagraph: text(doc.briefparagraph),
      description: str(doc.description),
      marketSize: str(doc.marketSize),
      existingSolutions: str(doc.existingSolutions),
      currentGaps: str(doc.currentGaps),
      targetCustomers: str(doc.targetCustomers),
      image: str(doc.image),
      upvotes: Math.max(toInt(doc.upvotes), upvotedBy.length),
      background: str(doc.background),
      scalability: str(doc.scalability),
      addedByName: text(doc.addedByName),
      addedByEmail: emailOf(doc.addedByEmail),
      tags: tagList(doc.tags),
      ...verificationFields(doc),
      ...(toDate(doc.createdAt) ? { createdAt: toDate(doc.createdAt) } : {}),
    },
    collaborators: emailList(doc.collaborators),
    upvotedBy,
    comments: mapComments(doc.comments, `legacy-${problemId}`),
  };
}

const WORTHINESS = new Set(['HIGH', 'MEDIUM', 'LOW']);

function mapIdea(doc) {
  const ideaId = str(doc.ideaId) || str(doc._id);
  const upvotedBy = emailList(doc.upvotedBy);
  const level = (str(doc.worthinessLevel) || '').toUpperCase();
  // The legacy site nests these: startupStatus: { isWorthy, hasStartupCreated }, and calls the team "team".
  const status = doc.startupStatus && typeof doc.startupStatus === 'object' ? doc.startupStatus : {};
  const team = Array.isArray(doc.team) ? doc.team : doc.teamMembers;
  return {
    ideaId,
    unknownKeys: Object.keys(doc).filter((k) => !IDEA_KNOWN.has(k)),
    data: {
      ideaId,
      title: text(doc.title),
      description: text(doc.description),
      titleImage: str(doc.titleImage),
      relatedProblemId: str(doc.relatedProblemId),
      stage: toInt(doc.stage, 1) || 1,
      upvotes: Math.max(toInt(doc.upvotes), upvotedBy.length),
      mentor: str(doc.mentor),
      contact: str(doc.contact),
      addedByName: text(doc.addedByName),
      addedByEmail: emailOf(doc.addedByEmail),
      tags: tagList(doc.tags),
      targetCustomers: str(doc.targetCustomers),
      ...verificationFields(doc),
      isStartupWorthy: toBool(doc.isStartupWorthy ?? status.isWorthy),
      worthinessLevel: WORTHINESS.has(level) ? level : null,
      evaluatedAt: toDate(doc.evaluatedAt) ?? null,
      hasStartupCreated: toBool(doc.hasStartupCreated ?? status.hasStartupCreated),
      ...(toDate(doc.createdAt) ? { createdAt: toDate(doc.createdAt) } : {}),
    },
    collaborators: emailList(doc.collaborators),
    upvotedBy,
    teamMembers: (Array.isArray(team) ? team : [])
      .map((m) => ({
        name: text(m.name),
        email: emailOf(m.email) || null,
        role: text(m.role, 'Member'),
        image: str(m.image),
      }))
      .filter((m) => m.name),
    comments: mapComments(doc.comments, `legacy-${ideaId}`),
    attachments: (Array.isArray(doc.attachments) ? doc.attachments : [])
      .map((a) => ({
        name: text(a.name),
        url: text(a.url),
        type: text(a.type, 'file'),
        size: text(a.size, '0'),
        accessLevel: accessLevel(a.accessLevel),
        uploadedBy: text(a.uploadedBy),
        uploadedAt: toDate(a.uploadedAt),
      }))
      .filter((a) => a.url),
    links: (Array.isArray(doc.links) ? doc.links : [])
      .map((l) => ({
        title: text(l.title, text(l.url)),
        url: text(l.url),
        description: str(l.description),
        accessLevel: accessLevel(l.accessLevel),
        addedBy: text(l.addedBy),
        addedAt: toDate(l.addedAt),
      }))
      .filter((l) => l.url),
  };
}

// ─── writing ────────────────────────────────────────────────────────────────

const withDate = (d) => (d ? { createdAt: d } : {});

async function writeProblem(tx, m, knownUsers) {
  const row = await tx.problem.upsert({ where: { problemId: m.problemId }, create: m.data, update: m.data });

  await tx.problemCollaborator.createMany({
    data: m.collaborators.map((email) => ({ problemId: row.id, email })),
    skipDuplicates: true,
  });
  await tx.problemUpvote.createMany({
    data: m.upvotedBy.filter((e) => knownUsers.has(e)).map((userEmail) => ({ problemId: row.id, userEmail })),
    skipDuplicates: true,
  });

  for (const c of m.comments) {
    if (!knownUsers.has(c.email)) continue;
    const comment = await tx.problemComment.upsert({
      where: { commentId: c.commentId },
      create: {
        commentId: c.commentId, problemId: row.id, text: c.text, name: c.name, email: c.email,
        likes: c.likes, ...withDate(c.createdAt),
      },
      update: { text: c.text, name: c.name, likes: c.likes },
    });
    await tx.problemCommentLike.createMany({
      data: c.likedBy.map((userEmail) => ({ commentId: comment.id, userEmail })),
      skipDuplicates: true,
    });
    for (const r of c.replies) {
      const reply = await tx.problemCommentReply.upsert({
        where: { replyId: r.replyId },
        create: {
          replyId: r.replyId, commentId: comment.id, text: r.text, name: r.name, email: r.email,
          likes: r.likes, ...withDate(r.createdAt),
        },
        update: { text: r.text, name: r.name, likes: r.likes },
      });
      await tx.problemReplyLike.createMany({
        data: r.likedBy.map((userEmail) => ({ replyId: reply.id, userEmail })),
        skipDuplicates: true,
      });
    }
  }
}

async function writeIdea(tx, m, knownUsers) {
  const row = await tx.idea.upsert({ where: { ideaId: m.ideaId }, create: m.data, update: m.data });

  await tx.ideaCollaborator.createMany({
    data: m.collaborators.map((email) => ({ ideaId: row.id, email })),
    skipDuplicates: true,
  });
  await tx.ideaUpvote.createMany({
    data: m.upvotedBy.filter((e) => knownUsers.has(e)).map((userEmail) => ({ ideaId: row.id, userEmail })),
    skipDuplicates: true,
  });

  // These three have no natural unique key, so re-create them - but only when
  // the source actually has some, so a re-run never wipes rows added later.
  if (m.teamMembers.length) {
    await tx.ideaTeamMember.deleteMany({ where: { ideaId: row.id } });
    await tx.ideaTeamMember.createMany({ data: m.teamMembers.map((t) => ({ ...t, ideaId: row.id })) });
  }
  if (m.attachments.length) {
    await tx.ideaAttachment.deleteMany({ where: { ideaId: row.id } });
    await tx.ideaAttachment.createMany({
      data: m.attachments.map((a) => ({ ...a, ideaId: row.id, uploadedAt: a.uploadedAt ?? undefined })),
    });
  }
  if (m.links.length) {
    await tx.ideaLink.deleteMany({ where: { ideaId: row.id } });
    await tx.ideaLink.createMany({
      data: m.links.map((l) => ({ ...l, ideaId: row.id, addedAt: l.addedAt ?? undefined })),
    });
  }

  for (const c of m.comments) {
    if (!knownUsers.has(c.email)) continue;
    const comment = await tx.ideaComment.upsert({
      where: { commentId: c.commentId },
      create: {
        commentId: c.commentId, ideaId: row.id, author: c.name, content: c.text, email: c.email,
        ...withDate(c.createdAt),
      },
      update: { author: c.name, content: c.text },
    });
    await tx.ideaCommentLike.createMany({
      data: c.likedBy.map((userEmail) => ({ commentId: comment.id, userEmail })),
      skipDuplicates: true,
    });
    for (const r of c.replies) {
      const reply = await tx.ideaCommentReply.upsert({
        where: { replyId: r.replyId },
        create: {
          replyId: r.replyId, commentId: comment.id, author: r.name, content: r.text, email: r.email,
          ...withDate(r.createdAt),
        },
        update: { author: r.name, content: r.text },
      });
      await tx.ideaReplyLike.createMany({
        data: r.likedBy.map((userEmail) => ({ replyId: reply.id, userEmail })),
        skipDuplicates: true,
      });
    }
  }
}

// ─── driver ─────────────────────────────────────────────────────────────────

function referencedEmails(mapped) {
  const emails = new Set();
  for (const m of mapped) {
    emails.add(m.data.addedByEmail);
    m.upvotedBy.forEach((e) => emails.add(e));
    // Replies, likes and collaborators are stored as plain emails (no foreign
    // key), so only authors, upvoters and comment authors must have accounts.
    m.comments.forEach((c) => emails.add(c.email));
  }
  emails.delete('');
  return emails;
}

async function importKind({ label, mapped, idField, write, dryRun, knownUsers, extraCheck }) {
  const stats = { imported: 0, skipped: [], warnings: [], failed: [] };
  const unknownKeys = new Set();

  for (const m of mapped) {
    const id = m[idField];
    m.unknownKeys.forEach((k) => unknownKeys.add(k));

    if (!id || !m.data.title) {
      stats.skipped.push(`${id || '(no id)'}: missing id or title`);
      continue;
    }
    if (!m.data.addedByEmail || !knownUsers.has(m.data.addedByEmail)) {
      stats.skipped.push(`${id} "${m.data.title}": author ${m.data.addedByEmail || '(none)'} has no account`);
      continue;
    }
    const droppedChildren =
      m.upvotedBy.filter((e) => !knownUsers.has(e)).length +
      m.comments.filter((c) => !knownUsers.has(c.email)).length;
    if (droppedChildren) {
      stats.warnings.push(`${id}: ${droppedChildren} upvote/comment(s) by people with no account not imported`);
    }
    if (extraCheck) extraCheck(m, stats);

    if (dryRun) {
      stats.imported++;
      continue;
    }
    try {
      await prisma.$transaction((tx) => write(tx, m, knownUsers), { timeout: 60000 });
      stats.imported++;
    } catch (err) {
      stats.failed.push(`${id} "${m.data.title}": ${err.message.trim().split('\n').pop()}`);
    }
  }

  console.log(`\n${label}: ${dryRun ? 'would import' : 'imported'} ${stats.imported} of ${mapped.length}`);
  if (unknownKeys.size) {
    console.log(`  source fields NOT mapped (check they don't matter): ${[...unknownKeys].join(', ')}`);
  }
  for (const [name, list] of [['skipped', stats.skipped], ['warning', stats.warnings], ['FAILED', stats.failed]]) {
    if (list.length) {
      console.log(`  ${list.length} ${name}:`);
      list.forEach((l) => console.log(`    - ${l}`));
    }
  }
  return stats;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  console.log(args.dryRun ? 'DRY RUN - nothing will be written.' : 'LIVE RUN - writing to the database.');

  const problems = args.problems ? readRecords(args.problems, ['problems', 'data', 'items']).map(mapProblem) : [];
  const ideas = args.ideas ? readRecords(args.ideas, ['ideas', 'data', 'items']).map(mapIdea) : [];

  const wanted = referencedEmails([...problems, ...ideas]);
  const found = await prisma.user.findMany({ where: { email: { in: [...wanted] } }, select: { email: true } });
  const knownUsers = new Set(found.map((u) => u.email.toLowerCase()));
  const missing = [...wanted].filter((e) => !knownUsers.has(e));
  console.log(`People referenced: ${wanted.size}, with an account: ${knownUsers.size}, without: ${missing.length}`);
  if (missing.length) {
    console.log('Create these accounts first (migrate_mongo_users / public-auth upsert), then re-run:');
    missing.forEach((e) => console.log(`    ${e}`));
  }

  let failed = 0;
  const problemStats = await importKind({
    label: 'Problems', mapped: problems, idField: 'problemId', write: writeProblem, dryRun: args.dryRun, knownUsers,
  });
  failed += problemStats.failed.length;

  // Ideas link to a problem by its legacy problemId - which must exist by now.
  const existingProblems = new Set(
    (await prisma.problem.findMany({ select: { problemId: true } })).map((p) => p.problemId)
  );
  if (args.dryRun) problems.forEach((p) => existingProblems.add(p.problemId));
  const ideaStats = await importKind({
    label: 'Ideas', mapped: ideas, idField: 'ideaId', write: writeIdea, dryRun: args.dryRun, knownUsers,
    extraCheck: (m, stats) => {
      const rel = m.data.relatedProblemId;
      if (rel && !existingProblems.has(rel)) {
        stats.warnings.push(`${m.ideaId}: related problem ${rel} not found, link cleared`);
        m.data.relatedProblemId = null;
      }
    },
  });
  failed += ideaStats.failed.length;

  console.log(failed ? `\nFinished with ${failed} failure(s).` : '\nFinished with no failures.');
  return failed ? 1 : 0;
}

(async () => {
  let code = 1;
  try {
    code = await main();
  } catch (err) {
    console.error(`\nError: ${err.message}`);
  } finally {
    await prisma.$disconnect();
  }
  process.exit(code);
})();
