import React, { useState, useEffect } from "react";
import CertificateStore from "./indexeddb/certificateStore";
const cerStore = new CertificateStore();

export default () => {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    async function init() {
      let items = await cerStore.getAllCertificates();
      setCertificates(items);
    }
    init();
  }, [createCertificate, removeCertificate]);

  function createCertificate(
    id,
    name,
    surname,
    nationality,
    dateOfBirth,
    content,
    secret
  ) {
    cerStore.createCertificate(
      id,
      name,
      surname,
      nationality,
      dateOfBirth,
      content,
      secret
    );
  }

  function removeCertificate(id) {
    cerStore.removeCertificate(id);
  }

  async function saveCertificate(id) {}

  async function signCertificate(id) {}

  return { certificates, removeCertificate, createCertificate };
};
