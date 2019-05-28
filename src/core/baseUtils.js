import bs58 from "bs58";

function getRandomKey() {
  var array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return array;
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function ab2base64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base642ab(base64Str) {
  return Uint8Array.from(atob(base64Str), c => c.charCodeAt(0));
}

function base582hex(base58Str) {
  return (
    "0x" +
    bs58
      .decode(base58Str)
      .slice(2)
      .toString("hex")
  );
}

function hex2base58(hexStr) {
  const hashHex = "1220" + hexStr.slice(2);
  const hashBytes = Buffer.from(hashHex, "hex");
  const hashStr = bs58.encode(hashBytes);
  return hashStr;
}

function ab2hex(buffer) {
  let str = Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  return "0x" + str;
}

function readFileAsArrayBuffer(inputFile) {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsArrayBuffer(inputFile);
  });
}

export {
  ab2str,
  getRandomKey,
  readFileAsArrayBuffer,
  ab2hex,
  base582hex,
  hex2base58,
  ab2base64,
  base642ab
};
