const CCAvenueNonSeamlessNode = require("../app"); // Import the class

// Create an instance of CCAvenueNonSeamlessNode
const ccavInstance = new CCAvenueNonSeamlessNode();

// Call the getAlgorithm method on the instance
const algorithm = ccavInstance.getAlgorithm("yourKeyBase64");

console.log(algorithm); // Print the algorithm
