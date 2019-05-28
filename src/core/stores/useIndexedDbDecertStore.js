import React from "react";
import Dexie from "dexie";
const db = new Dexie("DecertDB");
db.version(1).stores({
  files: "id",
  signatures: "id"
});

export default () => {
  async function sign(id, fileAddress, encryptedContent, createdAt) {
    db.files.add({
      id: fileAddress,
      content: encryptedContent
    });
    db.signatures.add({
      id: id,
      fileAddress: fileAddress,
      dateOfIssue: createdAt,
      issuer: "Decentralized Inc."
    });
  }

  async function getBySecret(id) {
    let signedCertificate = await db.signatures.get(id);
    let file = await db.files.get(signedCertificate.fileAddress);
    return {
      content: file.content,
      dateOfIssue: signedCertificate.dateOfIssue,
      issuer: signedCertificate.issuer
    };
  }

  return {
    sign,
    getBySecret
  };
};
