import Dexie from "dexie";
const db = new Dexie("SignatureDB");
db.version(1).stores({
  signatures: "id"
});
