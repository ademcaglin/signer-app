import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { green, red } from "@material-ui/core/colors";
import ErrorIcon from "@material-ui/icons/Error";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import useCertificate from "../core/useCertificate";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;

const useStyles = makeStyles({
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  },
  error: {
    backgroundColor: red[600]
  },
  message: {
    display: "flex",
    alignItems: "center"
  },
  iconVariant: {
    opacity: 0.9
  },
  success: {
    backgroundColor: green[600]
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

export default props => {
  const classes = useStyles();
  const { closeView, selectedSecret } = props;
  const [certificate, setCertificate] = useState();
  const { getCertificate } = useCertificate();
  useEffect(() => {
    async function setCer(secret) {
      if (secret) {
        let cer = await getCertificate(secret);
        setCertificate(cer);
      }
    }
    setCer(selectedSecret);
  }, [selectedSecret, setCertificate]);

  function hasCertificate() {
    return certificate && Object.entries(certificate).length !== 0;
  }

  return (
    <Dialog
      fullScreen
      open={selectedSecret ? true : false}
      onClose={() => closeView()}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.flex} />
          <IconButton
            color="inherit"
            onClick={() => closeView()}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {hasCertificate() && (
        <Grid container justify="center">
          <Paper className={classes.root} elevation={1}>
            <SnackbarContent
              className={classes.success}
              aria-describedby="client-snackbar"
              message={
                <span id="client-snackbar" className={classes.message}>
                  <CheckCircleIcon className={classes.iconVariant} />
                  {certificate.issuer} {certificate.dateOfIssue}
                </span>
              }
            />
            <Typography variant="h5" component="h3" />
            <Typography component="p" />
            <Divider />
            <Document file={certificate.content}>
              <Page pageNumber={1} />
            </Document>
          </Paper>
        </Grid>
      )}
    </Dialog>
  );
};
