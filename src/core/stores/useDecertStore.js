import React from "react";
const ipfs = ipfsClient("ipfs.infura.io", "5001", {
  protocol: "https"
});

export default () => {
  async function signCertificate(id) {
    /*
    await drizzle.contracts.CertificateStorage.methods
      .createCertificate(id, fileAddress, createdAt)
      .send(drizzleState.accounts[0]);
    ipfs.add(encryptedContent, (err, result) => {
        if (err) {
          reject(new DOMException(err));
        }
        resolve(result[0].hash);
      });
    */
    /*let cer = await db.certificates.get(id);
    let encryptedContent = await getEncryptedContent(
      cer.content,
      base642ab(cer.secret)
    );
    let fileAddressAB = await crypto.subtle.digest("SHA-256", encryptedContent);
    let fileAddress = hex2base58(ab2hex(fileAddressAB));
    let createdAt = Math.floor(Date.now() / 1000);
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
    db.certificates.update(id, { state: "SIGNED" });*/
  }

  async function getSignedSignature(secret64) {
    /*ipfs.get(fileAddress, (err, files) => {
      if (err) {
        reject(new DOMException(err));
      }
      let encrypted = files[0].content;
      resolve(encrypted);
    });*/
    /*let secret = base642ab(secret64);
    let idAB = await crypto.subtle.digest("SHA-256", secret);
    let id = ab2hex(idAB);
    let signedCertificate = await db.certificates.get(id);
    let encryptedContent = await db.files.get(signedCertificate.fileAddress);
    let content = await getRawContent(encryptedContent, secret);
    return {
      content: content,
      dateOfIssue: signedCertificate.dateOfIssue,
      issuer: signedCertificate.issuer
    };*/
  }

  async function addToIpfs(content) {
    return new Promise((resolve, reject) => {
      ipfs.add(content, (err, result) => {
        if (err) {
          reject(new DOMException(err));
        }
        resolve(result[0].hash);
      });
    });
  }

  async function getFromIpfs(fileAddress) {
    return new Promise((resolve, reject) => {
      ipfs.get(fileAddress, (err, files) => {
        if (err) {
          reject(new DOMException(err));
        }
        let encrypted = files[0].content;
        resolve(content);
      });
    });
  }

  return {
    signCertificate,
    getSignedSignature
  };
};
