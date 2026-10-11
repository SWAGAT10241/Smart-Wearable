#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function parseArguments(args) {
  if (args[0] === "--") args = args.slice(1);
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--help" || argument === "-h") return { help: true };
    if (!["--private-key-file", "--public-key-file"].includes(argument)) {
      throw new TypeError(`Unknown argument: ${argument}`);
    }
    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new TypeError(`Missing value for ${argument}`);
    }
    const key = argument.slice(2).replace(/-([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    );
    if (options[key] !== undefined) {
      throw new TypeError(`Duplicate argument: ${argument}`);
    }
    options[key] = path.resolve(process.cwd(), value);
    index += 1;
  }
  if (!options.privateKeyFile || !options.publicKeyFile) {
    throw new TypeError("--private-key-file and --public-key-file are required");
  }
  if (options.privateKeyFile === options.publicKeyFile) {
    throw new TypeError("Private and public keys require separate output files");
  }
  return options;
}

function writeExclusive(filePath, contents, mode) {
  fs.writeFileSync(filePath, contents, {
    encoding: "utf8",
    flag: "wx",
    mode,
  });
}

function generateAuthorityKeys(options) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
  const privatePem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  const publicDer = publicKey.export({ type: "spki", format: "der" });
  const publicKeyBase64url = publicDer.subarray(-32).toString("base64url");
  writeExclusive(options.privateKeyFile, privatePem, 0o600);
  try {
    writeExclusive(options.publicKeyFile, `${publicKeyBase64url}\n`, 0o644);
  } catch (error) {
    fs.unlinkSync(options.privateKeyFile);
    throw error;
  }
  return {
    privateKeyFile: options.privateKeyFile,
    publicKeyFile: options.publicKeyFile,
    publicKeyBase64url,
  };
}

if (require.main === module) {
  try {
    const options = parseArguments(process.argv.slice(2));
    if (options.help) {
      process.stdout.write(
        "Generate a device authorization Ed25519 authority key pair.\n" +
          "Usage: pnpm generate-device-authority-keys -- --private-key-file <private.pem> --public-key-file <public-base64url.txt>\n" +
          "Store the private key in the backend secret manager. Copy only the public key into the firmware build configuration.\n",
      );
    } else {
      process.stdout.write(`${JSON.stringify(generateAuthorityKeys(options), null, 2)}\n`);
    }
  } catch (error) {
    process.stderr.write(`Key generation failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = { generateAuthorityKeys, parseArguments };
