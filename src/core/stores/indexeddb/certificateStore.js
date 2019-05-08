import Dexie from "dexie";
const db = new Dexie("CertificateDB");
db.version(1).stores({
  certificates: "id"
});

export default class CertificateStore {
  createCertificate(cer) {
    db.certificates.add({
      ...cer,
      state: "NEW"
    });
  }

  removeCertificate(id) {
    db.certificates.delete(id);
  }

  async getAllCertificates(page, pageSize) {
    let all = await db.certificates.toArray();
    let items = all.slice((page - 1) * pageSize, page * pageSize);
    return {
      hasMore: all.length - page * pageSize > 0,
      items: items
    };
  }

  async getCertificate(id) {
    return await db.certificates.get(id);
  }

  updateCertificate(id, properties) {
    db.certificates.update(id, properties);
  }
}
