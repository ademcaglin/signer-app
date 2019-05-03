import React from "react";
import { Text, Page, Document, pdf } from "@react-pdf/renderer";

const SampleCertificate = info => (
  <Document>
    <Page>
      <Text>Name: {info.name}</Text>
      <Text>Surname: {info.surname}</Text>
      <Text>Date Of Birth: {info.dateOfBirth}</Text>
      <Text>Nationality: {info.nationality}</Text>
    </Page>
  </Document>
);

const getSampleCertificate = async info => {
  let blob = await pdf(<SampleCertificate info={info} />).toBlob();
  return blob;
};

export default getSampleCertificate;
