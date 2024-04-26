const CCAvenueNonSeamlessNode = require("cc-aveunue-non-seamless-node"); // Import the class

// Create an instance of CCAvenueNonSeamlessNode
const ccavInstance = new CCAvenueNonSeamlessNode();

// Call the paymenturl method on the instance
const paymenturl = ccavInstance.getPaymentResponse(
  "yourKeyBase64",
  "workingkey"
);

console.log(paymenturl); // Print the paymenturl
