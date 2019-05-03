import { Text, Page, Document, pdf } from "@react-pdf/renderer";
import React, { useEffect } from "react";
import { ab2str, readFileAsArrayBuffer } from "../core/baseUtils";
const CertificateDocument = () => (
  <Document>
    <Page>
      <Text>xvxvxv</Text>
    </Page>
  </Document>
);

const printPDF = async () => {
  let blob = await pdf(<CertificateDocument />).toBlob();
  let ab = await readFileAsArrayBuffer(blob);
  console.log(ab2str(ab));
};

export default () => {
  useEffect(() => {
    printPDF();
  }, []);

  return <div>cer</div>;
};
