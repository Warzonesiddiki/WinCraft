import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

test("license signing, verification, and edge-case failure modes", async () => {
  // Generate a test Ed25519 key pair
  const { privateKey, publicKey } = crypto.generateKeyPairSync("ed25519");
  const privateKeyB64 = privateKey.export({ format: "der", type: "pkcs8" }).toString("base64");
  const publicKeyB64 = publicKey.export({ format: "der", type: "spki" }).toString("base64");

  // Temporarily set env var for license module
  const originalKey = process.env.LICENSE_SIGNING_PRIVATE_KEY;
  process.env.LICENSE_SIGNING_PRIVATE_KEY = privateKeyB64;

  const licenseModule = await import("../dist/license.js");
  const { signLicense, verifyLicense } = licenseModule;

  try {
    // 1. Valid non-expired license
    const validPayload = {
      userId: "12345",
      isPro: true,
      plan: "lifetime",
      product: "wincraft",
      issuedAt: Math.floor(Date.now() / 1000),
      expiresAt: null,
    };
    const signed = signLicense(validPayload);
    assert.ok(signed.payloadJson);
    assert.ok(signed.signature);

    const verified = verifyLicense(signed, publicKeyB64);
    assert.equal(verified.valid, true);
    assert.equal(verified.payload.userId, "12345");
    assert.equal(verified.payload.plan, "lifetime");

    // 2. Expired license
    const expiredPayload = {
      userId: "12345",
      isPro: true,
      plan: "annual",
      product: "wincraft",
      issuedAt: Math.floor(Date.now() / 1000) - 86400 * 400,
      expiresAt: Math.floor(Date.now() / 1000) - 86400, // expired yesterday
    };
    const signedExpired = signLicense(expiredPayload);
    const verifiedExpired = verifyLicense(signedExpired, publicKeyB64);
    assert.equal(verifiedExpired.valid, false);
    assert.equal(verifiedExpired.error, "license expired");

    // 3. Tampered payload
    const tamperedPayload = {
      payloadJson: signed.payloadJson.replace("lifetime", "annual"),
      signature: signed.signature,
    };
    const verifiedTampered = verifyLicense(tamperedPayload, publicKeyB64);
    assert.equal(verifiedTampered.valid, false);
    assert.equal(verifiedTampered.error, "invalid signature");

    // 4. Tampered signature
    const corruptedSig = {
      payloadJson: signed.payloadJson,
      signature: Buffer.from("corrupted-signature-bytes").toString("base64"),
    };
    const verifiedCorrupted = verifyLicense(corruptedSig, publicKeyB64);
    assert.equal(verifiedCorrupted.valid, false);

    // 5. Malformed license input
    assert.equal(verifyLicense(null, publicKeyB64).valid, false);
    assert.equal(verifyLicense({}, publicKeyB64).valid, false);
    assert.equal(verifyLicense({ payloadJson: "bad", signature: "bad" }, "invalid-pubkey").valid, false);
  } finally {
    process.env.LICENSE_SIGNING_PRIVATE_KEY = originalKey;
  }
});
