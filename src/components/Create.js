import React, { useState } from "react";
import {
  Text,
  Page,
  Document,
  pdf,
  StyleSheet,
  Image
} from "@react-pdf/renderer";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import {
  ab2base64,
  getRandomKey,
  readFileAsArrayBuffer,
  ab2hex
} from "../core/baseUtils";
import QRCode from "qrcode";
import { pdfjs } from "react-pdf";
import useCertificate from "../core/useCertificate";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;
const styles = StyleSheet.create({
  body: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 5
  },
  title: {
    fontSize: 24,
    textAlign: "center"
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40
  },
  subtitle: {
    fontSize: 18,
    margin: 12
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman"
  },
  image: {
    width: 100,
    height: 100
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey"
  }
});
const useStyles = makeStyles({});

const SampleCertificate = ({ info, imgSrc }) => (
  <Document>
    <Page size="A4" style={styles.body}>
      <Text>Name: {info.name}</Text>
      <Text>Surname: {info.surname}</Text>
      <Text>Date Of Birth: {info.dateOfBirth}</Text>
      <Text>Nationality: {info.nationality}</Text>
      <Image source={info.qr} style={styles.image} />
    </Page>
  </Document>
);

const getSampleCertificate = async info => {
  let blob = await pdf(<SampleCertificate info={info} />).toBlob();
  return blob;
};

const Create = props => {
  const classes = useStyles();
  const [open, setOpen] = useState();
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [nationality, setNationality] = useState();
  const { createCertificate } = useCertificate();
  function handleClose() {
    setOpen(false);
  }
  function handleOpen() {
    setOpen(true);
  }

  async function handleCreate() {
    let info = {
      name: name,
      surname: surname,
      dateOfBirth: dateOfBirth,
      nationality: nationality
    };
    let secret = getRandomKey();
    let qr = await QRCode.toDataURL(ab2base64(secret));
    console.log(qr);
    let pdfContent = await getSampleCertificate({ ...info, qr: qr });

    let id = await window.crypto.subtle.digest("SHA-256", secret);
    let cer = {
      id: ab2hex(id),
      secret: ab2base64(secret),
      content: await readFileAsArrayBuffer(pdfContent)
    };

    await createCertificate(cer);
    window.location.reload();
  }

  return (
    <>
      <Button color="inherit" onClick={handleOpen}>
        <Icon className={classes.icon}>add</Icon>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Certificate</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a certificate fill the inputs.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            onChange={e => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="surname"
            label="Surname"
            type="text"
            fullWidth
            onChange={e => setSurname(e.target.value)}
          />
          <TextField
            margin="dense"
            id="dateOfBirth"
            label="Date of Birth"
            type="text"
            fullWidth
            onChange={e => setDateOfBirth(e.target.value)}
          />
          <TextField
            margin="dense"
            id="nationality"
            label="Natioanlity"
            type="text"
            fullWidth
            onChange={e => setNationality(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withRouter(Create);

/*import React from "react";
import { Text, Page, Document, pdf } from "@react-pdf/renderer";
import { readFileAsArrayBuffer, ab2base64 } from "../core/baseUtils";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;
const PDFJS_I = require("pdfjs-dist");

const SampleCertificate = ({ info }) => (
  <Document subject="{info.metadata}">
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
  let data = await readFileAsArrayBuffer(blob);
  let doc = await PDFJS_I.getDocument(data);
  let stuff = await doc.getMetadata();
  console.log(stuff.info.Subject);

  return blob;
};

export default getSampleCertificate;*/
