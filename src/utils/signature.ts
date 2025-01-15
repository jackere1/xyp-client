import { createSign } from "crypto";
import fs from "fs";

/**
 * @description Digital signing method for Khur SOAP API
 * @param keyPath Key path to the cert file(.pem) khur provides
 * @param accessToken Token provided by khur
 */
const digitalSign = (keyPath: string, accessToken: string) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureData = `${accessToken}.${timestamp}`;

  const signatureSHA256 = createSign('SHA256');
  signatureSHA256.write(signatureData);
  signatureSHA256.end();

  const key = fs.readFileSync(keyPath);
  const base64Signature = signatureSHA256.sign(key, 'base64');

  return {
    timestamp,
    base64Signature
  }
};

export { digitalSign }