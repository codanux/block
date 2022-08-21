const web3 = require('../../web3')
const { Block } = require('../../models')
const block = new Block(web3);


block.receipts(11241836).then((res) => {
    console.log(res)
}).catch(console.error)
