async function getEncryptedContent(certificateArrayBuffer, secret) {
  let key = await crypto.subtle.importKey("raw", secret, "aes-ctr", false, [
    "encrypt"
  ]);
  let iv = secret.slice(0, 16);
  let encrypted = await crypto.subtle.encrypt(
    { name: "aes-ctr", counter: iv, length: 128 },
    key,
    certificateArrayBuffer
  );
  return encrypted;
}

async function getRawContent(encrptedArrayBuffer, secret) {
  let key = await crypto.subtle.importKey("raw", secret, "aes-ctr", false, [
    "decrypt"
  ]);
  let iv = secret.slice(0, 16);
  let content = await crypto.subtle.decrypt(
    { name: "aes-ctr", counter: iv, length: 128 },
    key,
    encrptedArrayBuffer
  );
  return content;
}

export { getEncryptedContent, getRawContent };
