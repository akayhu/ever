//import AsyncFetchHelper from 'async-fetch-helper';
//import config from 'src/configs/config';

var aes;

try {
  aes = require("aes-node");
  aes = aes.default || aes;
} catch(e) {
  console.error(e);
  aes = {
    encrypt104: function(input) { return 'No import "crypt104.js"';},
    decrypt104: function(input) { return 'No import "crypt104.js"';}
  }
}

function decryptedString (inputString) {
  var codeUrl = "plus_rest.server.services.AESService.decrypt";
  return aes.decrypt104(codeUrl, inputString)
}

function encryptedString(inputString) {
  var codeUrl = "plus_rest.server.services.AESService.encrypt";
  return aes.encrypt104(codeUrl, inputString)
}

class AESService {

	static getInstance() {
		if(!this.aesService){
			this.aesService = new this;
		}

		return this.aesService;
	}

	constructor() {
		// this.asyncFetchHelper = new AsyncFetchHelper({
		// 	apiUrl : config.params.apiUrl.esb
		// });
		this.aesService = null;
	}


  decrypt(inputString, callback) {
    if (!inputString) {
      if(callback) callback({error: 'inputString is empty!'})
    } else {
      if(callback) {
        callback({
          response: {
            decrypted: decryptedString(inputString),
          }
        })
      }
    }
  }
  encrypt(inputString, callback) {
    if (!inputString) {
      if(callback) callback({error: 'inputString is empty!'})
    } else {
      if(callback) {
        callback({
          response: {
            encrypted: encryptedString(inputString),
          }
        })
      }
    }
  }
}

export default AESService;
