import React, { useState } from "react";
import { Text, Page, Document, pdf } from "@react-pdf/renderer";
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
  readFileAsArrayBuffer
} from "../core/baseUtils";
import { CertificateStore } from "../core/stores";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;
const cerStore = new CertificateStore();

const useStyles = makeStyles({});

const SampleCertificate = ({ info }) => (
  <Document>
    <Page size="A7">
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

const Create = props => {
  const classes = useStyles();
  const [open, setOpen] = useState();
  function handleClose() {
    setOpen(false);
  }
  function handleOpen() {
    setOpen(true);
  }

  async function handleCreate() {
    let info = {
      name: "Adem",
      surname: "Caglin",
      dateOfBirth: "01.01.0001",
      nationality: "TR"
    };

    let pdfContent = await getSampleCertificate(info);
    let secret = getRandomKey();
    let id = await window.crypto.subtle.digest("SHA-256", secret);
    let cer = {
      id: ab2base64(id),
      secret: ab2base64(secret),
      content: await readFileAsArrayBuffer(pdfContent)
    };

    cerStore.createCertificate(cer);
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
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a certificate fill the inputs.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
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
