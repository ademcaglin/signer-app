import React, { useEffect } from "react";
import useCertificate from "../core/useCertificate";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/styles";
import { getRandomKey } from "../core/baseUtils";
import getSampleCertificate from "./SampleCertificate";

const useStyles = makeStyles({
  root: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  }
});
export default () => {
  const classes = useStyles();
  const {
    createCertificate,
    removeCertificate,
    certificates
  } = useCertificate();

  async function createCer() {
    let info = {
      name: "Adem",
      surname: "Caglin",
      dateOfBirth: "01.01.0001",
      nationality: "TR"
    };
    let pdf = await getSampleCertificate(info);
    let secret = getRandomKey();
    createCertificate(
      secret,
      info.name,
      info.surname,
      info.dateOfBirth,
      info.nationality,
      pdf,
      secret
    );
  }
  return (
    <>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Sur Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Nationalaity</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {certificates.map(cer => {
              return (
                <TableRow key={cer.id}>
                  <TableCell align="left">{cer.name}</TableCell>
                  <TableCell align="left">{cer.surName}</TableCell>
                  <TableCell align="left">{cer.dateOfBirth}</TableCell>
                  <TableCell align="left">{cer.nationality}</TableCell>
                  <TableCell align="right">
                    <Button
                      color="inherit"
                      onClick={() => {
                        removeCertificate(cer.id);
                      }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
      <Button onClick={createCer}>Create Cert</Button>
    </>
  );
};
