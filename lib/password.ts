import crypto from "node:crypto";

const KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt);

  return `scrypt$${salt}$${hash}`;
}

export async function verifyPassword(password: string, storedPassword: string) {
  const [algorithm, salt, hash] = storedPassword.split("$");

  if (algorithm !== "scrypt" || !salt || !hash) {
    return password === storedPassword;
  }

  const inputHash = await scrypt(password, salt);

  return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(hash));
}

function scrypt(password: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey.toString("hex"));
    });
  });
}
