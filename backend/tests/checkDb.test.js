'use strict';

// Run with: npm test   (Node's built-in test runner, no extra packages)
const test = require('node:test');
const assert = require('node:assert/strict');
const net = require('node:net');
const { describeError, parseTarget, probe } = require('../scripts/check-db');

test('parseTarget returns the host and port and never the credentials', () => {
  const target = parseTarget('postgresql://user:s3cret@10.0.0.5:5434/plane?schema=public');
  assert.deepEqual(target, { host: '10.0.0.5', port: 5434 });
  assert.equal(JSON.stringify(target).includes('s3cret'), false);
});

test('parseTarget defaults the port to 5432', () => {
  assert.deepEqual(parseTarget('postgresql://u:p@db.internal/plane'), { host: 'db.internal', port: 5432 });
});

test('parseTarget rejects a missing or malformed URL', () => {
  assert.throws(() => parseTarget(undefined), /not set/);
  assert.throws(() => parseTarget(''), /not set/);
  assert.throws(() => parseTarget('not a url'), /not a valid URL/);
});

test('describeError explains each failure in plain words', () => {
  assert.match(describeError('ECONNREFUSED'), /nothing is listening/);
  assert.match(describeError('TIMEOUT'), /firewall/);
  assert.match(describeError('ETIMEDOUT'), /firewall/);
  assert.match(describeError('EHOSTUNREACH'), /no route/);
  assert.match(describeError('ENOTFOUND'), /does not resolve/);
  assert.match(describeError('EWEIRD'), /EWEIRD/);
});

test('probe reports a listening port as reachable', async () => {
  const server = net.createServer().listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    const result = await probe({ host: '127.0.0.1', port: server.address().port }, 2000);
    assert.equal(result.ok, true);
  } finally {
    server.close();
  }
});

test('probe reports a closed port as refused', async () => {
  const server = net.createServer().listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  await new Promise((resolve) => server.close(resolve)); // now nothing listens on it
  const result = await probe({ host: '127.0.0.1', port }, 2000);
  assert.equal(result.ok, false);
  assert.equal(result.code, 'ECONNREFUSED');
});
