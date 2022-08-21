const Web3 = require('web3');
module.exports = new Web3(Web3.givenProvider || 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
