import Dexie from "dexie";
const db = new Dexie("CertificateDB");
db.version(1).stores({
  certificates: "id"
});

export default class CertificateStore {
  createCertificate(
    id,
    name,
    surname,
    nationality,
    dateOfBirth,
    content,
    secret
  ) {
    db.certificates.add({
      id,
      name,
      surname,
      nationality,
      dateOfBirth,
      content,
      secret,
      state: "NEW"
    });
  }

  removeCertificate(id) {
    db.certificates.delete(id);
  }

  async getAllCertificates() {
    return await db.certificates.toArray();
  }

  async getCertificate(id) {
    return await db.certificates.get(id);
  }

  updateCertificate(id, properties) {
    db.certificates.update(id, properties);
  }
}
