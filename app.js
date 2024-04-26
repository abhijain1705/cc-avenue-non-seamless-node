const crypto = require("crypto");
const qs = require("querystring");

class CCAvenueNonSeamlessNode {
  constructor(options) {
    this.initOptions = options || {};
  }

  __getAlgorithm(keyBase64) {
    const key = Buffer.from(keyBase64, "base64");
    switch (key.length) {
      case 16:
        return "aes-128-cbc";
      case 32:
        return "aes-256-cbc";
    }
    throw new Error("Invalid key length: " + key.length);
  }

  _decrypt(messagebase64, keyBase64, ivBase64) {
    const key = Buffer.from(keyBase64, "base64");
    const iv = Buffer.from(ivBase64, "base64");

    const decipher = crypto.createDecipheriv(
      this.__getAlgorithm(keyBase64),
      key,
      iv
    );
    let decrypted = decipher.update(messagebase64, "hex");
    decrypted += decipher.final();
    return decrypted;
  }

  _encrypt(plainText, keyBase64, ivBase64) {
    const key = Buffer.from(keyBase64, "base64");
    const iv = Buffer.from(ivBase64, "base64");

    const cipher = crypto.createCipheriv(
      this.__getAlgorithm(keyBase64),
      key,
      iv
    );
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  getPaymentResponse(data, workingKeyInput) {
    var ccavEncResponse = data,
      ccavResponse = "",
      workingKey = workingKeyInput, //Put in the 32-Bit key shared by CCAvenues.
      ccavPOST = "",
      jsonObject = {};

    //Generate Md5 hash for the key and then convert in base64 string
    var md5 = crypto.createHash("md5").update(workingKey).digest();
    var keyBase64 = Buffer.from(md5).toString("base64");

    //Initializing Vector and then convert in base64 string
    var ivBase64 = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]).toString("base64");

    ccavPOST = qs.parse(ccavEncResponse);
    var encryption = ccavPOST.encResp;
    ccavResponse = this._decrypt(encryption, keyBase64, ivBase64);
    jsonObject = qs.parse(ccavResponse);
    console.log(jsonObject, "efdcs");

    return jsonObject;
  }

  getPaymentUrl(data, accessCodeInput, workingKeyInput) {
    // order params
    var body = data,
      workingKey = workingKeyInput, //Put in the 32-Bit key shared by CCAvenues.
      accessCode = accessCodeInput, //Put in the Access Code shared by CCAvenues.
      encRequest = "";

    //Generate Md5 hash for the key and then convert in base64 string
    var md5 = crypto.createHash("md5").update(workingKey).digest();
    var keyBase64 = Buffer.from(md5).toString("base64");

    //Initializing Vector and then convert in base64 string
    var ivBase64 = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]).toString("base64");

    encRequest = this._encrypt(body, keyBase64, ivBase64);
    return `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encRequest}&access_code=${accessCode}`;
  }
}

module.exports = CCAvenueNonSeamlessNode;
