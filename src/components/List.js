import React, { useEffect, useState } from "react";
import useCertificate from "../core/useCertificate";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import { pdfjs, Document, Page } from "react-pdf";
import Verify from "./Verify";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  paper: {
    height: 140,
    width: 100
  }
});
export default () => {
  const classes = useStyles();
  const {
    state,
    removeCertificate,
    fillCertificates,
    signCertificate
  } = useCertificate();
  const [selectedSecret, setSelectedSecret] = useState();

  return (
    <>
      <br />
      <br />
      <Grid container className={classes.root} spacing={16}>
        {state.items.map(item => {
          return (
            <Grid item xs={6}>
              <Paper className={classes.root} elevation={1}>
                <Typography variant="h5" component="h3">
                  {item.state === "NEW" && (
                    <>
                      <span>New</span>
                      <Button onClick={() => removeCertificate(item.id)}>
                        Remove
                      </Button>
                      <Button onClick={() => signCertificate(item.id)}>
                        Sign
                      </Button>
                    </>
                  )}
                  {item.state === "SIGNED" && (
                    <>
                      <span>Signed</span>
                      <Button onClick={() => setSelectedSecret(item.secret)}>
                        Verify
                      </Button>
                    </>
                  )}
                </Typography>
                <Typography component="p">
                  <Document file={item.content}>
                    <Page key={1} pageNumber={1} />
                  </Document>
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      {state.hasMore && (
        <Button
          onClick={() => {
            fillCertificates(state.page + 1, state.pageSize);
          }}
        >
          More...
        </Button>
      )}
      <Verify
        selectedSecret={selectedSecret}
        closeView={() => setSelectedSecret("")}
      />
    </>
  );
};

/*const [copySuccess, setCopySuccess] = useState("");

  function copyToClipboard(secret) {
    var textField = document.createElement("textarea");
    textField.innerText = secret;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    setCopySuccess("Copied!");
  }*/
/*<Button onClick={() => copyToClipboard(item.secret)}>
                    Copy
                  </Button>*/
