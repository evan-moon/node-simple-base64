const utf8 = require('nodejs-utf8');
const keyString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const regex = /[^A-Za-z0-9\+\/\=]/g;

module.exports = {
  encode (string) {
    if (!string || typeof string !== 'string') {
      throw new Error('argument must be a string');
    }
    string = utf8.encode(string);

    let output = '';
    let char1 = '';
    let char2 = '';
    let char3 = '';
    let enc1 = '';
    let enc2 = '';
    let enc3 = '';
    let enc4 = '';
    let i = 0;

    do {
      char1 = string.charCodeAt(i++);
      char2 = string.charCodeAt(i++);
      char3 = string.charCodeAt(i++);

      enc1 = char1 >> 2;
      enc2 = ((char1 & 3) << 4) | (char2 >> 4);
      enc3 = ((char2 & 15) << 2) | (char3 >> 6);
      enc4 = char3 & 63;

      if (isNaN(char2)) {
        enc3 = enc4 = 64;
      }
      else if (isNaN(char3)) {
        enc4 = 64;
      }

      output = output +
        keyString.charAt(enc1) +
        keyString.charAt(enc2) +
        keyString.charAt(enc3) +
        keyString.charAt(enc4);
      char1 = '';
      char2 = '';
      char3 = '';
      enc1 = '';
      enc2 = '';
      enc3 = '';
      enc4 = '';
    }
    while(i < string.length);

    return output;
  },
  decode (string) {
    let output = '';
    let char1 = '';
    let char2 = '';
    let char3 = '';
    let enc1 = '';
    let enc2 = '';
    let enc3 = '';
    let enc4 = '';
    let i = 0;

    if(regex.exec(string)) {
      throw new Error('There were invalid base64 characters in the input text.');
    }

    string = string.replace(regex, '');

    do {
      enc1 = keyString.indexOf(string.charAt(i++));
      enc2 = keyString.indexOf(string.charAt(i++));
      enc3 = keyString.indexOf(string.charAt(i++));
      enc4 = keyString.indexOf(string.charAt(i++));

      char1 = (enc1 << 2) | (enc2 >> 4);
      char2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      char3 = ((enc3 & 3) << 6) | enc4;

      output += String.fromCharCode(char1);

      if (enc3 !== 64) {
        output +=  String.fromCharCode(char2);
      }
      if (enc4 !== 64) {
        output += String.fromCharCode(char3);
      }

      char1 = '';
      char2 = '';
      char3 = '';
      enc1 = '';
      enc2 = '';
      enc3 = '';
      enc4 = '';
    }
    while (i < string.length);

    return utf8.decode(output);
  },
};