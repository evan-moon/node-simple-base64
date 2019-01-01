const base64 = require('./index');

const encodedKorean = base64.encode('안녕하세요');
const encoded = base64.encode('Hello World');

console.log(encodedKorean, base64.decode(encodedKorean));
console.log(encoded, base64.decode(encoded));