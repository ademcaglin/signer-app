import React from "react";
import Dexie from "dexie";
const db = new Dexie("CertDB");
db.version(1).stores({
  certificates: "id"
});

export default () => {
  async function create(newCer) {
    db.certificates.add({
      ...newCer,
      state: "NEW"
    });
  }

  async function remove(id) {
    db.certificates.delete(id);
  }

  async function getAll(page, pageSize) {
    let all = await db.certificates.toArray();
    let items = all.slice((page - 1) * pageSize, page * pageSize);
    return {
      hasMore: all.length - page * pageSize > 0,
      items: items
    };
  }

  async function getById(id) {
    return await db.certificates.get(id);
  }

  async function update(id, properties) {
    db.certificates.update(id, properties);
  }

  return {
    create,
    remove,
    getAll,
    getById,
    update
  };
};
