const fs = require("node:fs");
const path = require("node:path");

const imagePath = path.resolve("PRACTICE/Store-Image-database/upload/default.jpg");
console.log(imagePath);

const image = fs.readFileSync(imagePath , "base64");
console.log(image);