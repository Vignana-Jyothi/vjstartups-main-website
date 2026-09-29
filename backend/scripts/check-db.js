#!/usr/bin/env node
'use strict';

/**
 * Checks that the database named by DATABASE_URL is reachable over the network,
 * and says *why* not when it isn't. It only opens a TCP connection - it never
 * logs in - and prints the host and port only, never the credentials.
 *
 *   node scripts/check-db.js
 *
 * Exit code 0 = reachable, 1 = not reachable (or DATABASE_URL missing/invalid).
 */

const net = require('net');

const TIMEOUT_MS = 5000;

/** Plain-English meaning of the socket errors this check can hit. */
function describeError(code) {
  switch (code) {
    case 'ECONNREFUSED':
      return 'connection refused: the machine answered but nothing is listening on that port (wrong port, or the database is not running/published there)';
    case 'ETIMEDOUT':
    case 'TIMEOUT':
      return 'timed out: packets are being dropped - a firewall between the machines, or that address is not on this network';
    case 'EHOSTUNREACH':
    case 'ENETUNREACH':
      return 'no route to that address: this machine is not on the same network as the database host';
    case 'ENOTFOUND':
    case 'EAI_AGAIN':
      return 'the host name does not resolve';
    default:
      return `network error ${code || 'unknown'}`;
  }
}

/** Host and port from a postgres URL, without exposing the credentials. */
function parseTarget(databaseUrl) {
  if (!databaseUrl) throw new Error('DATABASE_URL is not set in this container');
  let url;
  try {
    url = new URL(databaseUrl);
  } catch (_) {
    throw new Error('DATABASE_URL is not a valid URL');
  }
  if (!url.hostname) throw new Error('DATABASE_URL has no host');
  return { host: url.hostname, port: Number(url.port) || 5432 };
}

function probe({ host, port }, timeoutMs = TIMEOUT_MS) {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    const finish = (result) => {
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(timeoutMs, () => finish({ ok: false, code: 'TIMEOUT' }));
    socket.once('connect', () => finish({ ok: true }));
    socket.once('error', (err) => finish({ ok: false, code: err.code }));
  });
}

async function main() {
  const target = parseTarget(process.env.DATABASE_URL);
  console.log(`host=${target.host} port=${target.port}`);
  const result = await probe(target);
  if (result.ok) {
    console.log('database port is reachable from this container');
    return 0;
  }
  console.log(`NOT reachable - ${describeError(result.code)}`);
  return 1;
}

module.exports = { describeError, parseTarget, probe };

if (require.main === module) {
  main().then(
    (code) => process.exit(code),
    (err) => {
      console.log(`NOT checked - ${err.message}`);
      process.exit(1);
    }
  );
}
