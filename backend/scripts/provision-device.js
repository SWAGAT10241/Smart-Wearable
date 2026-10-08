#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

require("dotenv").config({ quiet: true });

const mongoose = require("mongoose");
const {
  provisionDevice,
  validateDeviceId,
  validatePublicKey,
} = require("../services/deviceProvisioningService");

function parseArguments(args) {
  if (args[0] === "--") {
    args = args.slice(1);
  }
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--help" || argument === "-h") {
      return { help: true };
    }
    if (
      ![
        "--device-id",
        "--public-key-file",
        "--device-name",
        "--qr-output",
      ].includes(argument)
    ) {
      throw new Error(`Unknown argument: ${argument}`);
    }
    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${argument}`);
    }
    const key = argument.slice(2).replace(/-([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    );
    if (options[key] !== undefined) {
      throw new Error(`Duplicate argument: ${argument}`);
    }
    options[key] = value;
    index += 1;
  }

  if (!options.deviceId || !options.publicKeyFile) {
    throw new Error("--device-id and --public-key-file are required");
  }
  return options;
}

function printHelp() {
  process.stdout.write(
    [
      "Provision a new TrailGuard device using its device-generated Ed25519 public key.",
      "",
      "Usage: pnpm provision-device -- --device-id <UUIDv4> --public-key-file <path> [--device-name <name>] [--qr-output <private-file.svg>]",
      "",
      "Use --qr-output to create a one-time pairing QR as an SVG file. The QR contains a secret bootstrap token; protect the file and do not publish it.",
      "Without --qr-output, the one-time bootstrap token is printed as JSON and must be encoded securely by the operator.",
      "",
    ].join("\n"),
  );
}

function createPairingQrPayload(deviceId, bootstrapToken) {
  return JSON.stringify({ version: 1, deviceId, bootstrapToken });
}

async function main(args = process.argv.slice(2)) {
  const options = parseArguments(args);
  if (options.help) {
    printHelp();
    return;
  }
  if (!process.env.DEVICE_PROVISIONING_MONGODB_URI) {
    throw new Error("DEVICE_PROVISIONING_MONGODB_URI is required");
  }

  const deviceId = validateDeviceId(options.deviceId);
  if (options.deviceName && options.deviceName.trim().length > 50) {
    throw new TypeError("deviceName must be 50 characters or less");
  }
  const publicKeyPath = path.resolve(process.cwd(), options.publicKeyFile);
  if (fs.statSync(publicKeyPath).size > 16 * 1024) {
    throw new TypeError("public key file must be 16 KiB or smaller");
  }
  const publicKeyPem = validatePublicKey(
    fs.readFileSync(publicKeyPath, "utf8"),
  );
  let qrOutputPath;
  if (options.qrOutput) {
    qrOutputPath = path.resolve(process.cwd(), options.qrOutput);
    if (path.extname(qrOutputPath).toLowerCase() !== ".svg") {
      throw new TypeError("--qr-output must use the .svg extension");
    }
  }

  await mongoose.connect(process.env.DEVICE_PROVISIONING_MONGODB_URI);
  try {
    const provisioningResult = await provisionDevice({
      deviceId,
      publicKeyPem,
      deviceName: options.deviceName,
      prepareBootstrapToken: qrOutputPath
        ? async ({ deviceId: qrDeviceId, bootstrapToken }) => {
            let svg;
            try {
              svg = await QRCode.toString(
                createPairingQrPayload(qrDeviceId, bootstrapToken),
                {
                  type: "svg",
                  errorCorrectionLevel: "H",
                  margin: 4,
                },
              );
            } catch {
              throw new TypeError("Unable to generate the pairing QR SVG");
            }

            try {
              fs.writeFileSync(qrOutputPath, svg, {
                encoding: "utf8",
                flag: "wx",
                mode: 0o600,
              });
            } catch (error) {
              throw new TypeError(
                `Unable to create QR output file ${qrOutputPath}: ${error.message}`,
              );
            }

            return async () => fs.unlinkSync(qrOutputPath);
          }
        : undefined,
    });
    const output = qrOutputPath
      ? {
          deviceId: provisioningResult.deviceId,
          expiresAt: provisioningResult.expiresAt,
          qrFile: qrOutputPath,
        }
      : provisioningResult;
    process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  main().catch((error) => {
    if (error.code === 11000) {
      process.stderr.write(
        "Provisioning failed: deviceId already exists or cannot be safely reprovisioned.\n",
      );
    } else if (error instanceof TypeError) {
      process.stderr.write(`Provisioning failed: ${error.message}\n`);
    } else if (error.code === "ENOENT") {
      process.stderr.write("Provisioning failed: public key file was not found.\n");
    } else {
      process.stderr.write(
        "Provisioning failed due to a database or internal error. Check the operator environment and retry.",
      );
      process.stderr.write("\n");
    }
    process.exitCode = 1;
  });
}

module.exports = { createPairingQrPayload, main, parseArguments };
