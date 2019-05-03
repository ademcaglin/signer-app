import Dexie from "dexie";
import { getEncryptedContent, getRawContent } from "./cryptoUtils";
const db = new Dexie("FileDB");
db.version(1).stores({
  files: "id"
});

/**
 * save certificate into file storage(indexeddb)
 * @param {ArrayBuffer} content
 * @param {ArrayBuffer} secret
 */
async function saveFile(content, secret) {
  let encryptedContent = await getEncryptedContent(content, secret);
  let file_address = await crypto.subtle.digest(encryptedContent);
  db.files.add({ id: file_address, content: encryptedContent });
}

/**
 *
 * @param {ArrayBuffer} file_address: hash of encrypted file content
 * @param {ArrayBuffer} secret: the file's secret
 * @returns {Promise<ArrayBuffer>}
 */
async function getFile(file_address, secret) {
  let encryptedContent = await db.files.get(file_address).content;
  let content = await getRawContent(encryptedContent, secret);
  return content;
}

export { saveFile, getFile };
