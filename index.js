var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');

let blockReceipts = function (blockNumber) {
    return new Promise(async (resolve, reject) => {
        await web3.eth.getBlock(blockNumber, true)
            .then(async block => {

                let logs = await web3.eth.getPastLogs({
                    fromBlock: blockNumber,
                    toBlock: blockNumber,
                    topics: []
                }).catch(reject);


                if (logs) {
                    block.transactions = block.transactions.map(transaction => {
                        transaction.logs = logs.filter(log => log.transactionHash === transaction.hash)
                        return transaction;
                    })
                }

                resolve(block)
            }).catch(reject);
    })
}


blockReceipts(10008622).then((block) => {
    console.log(block)
}).catch(error => {
    console.log('error', error.message)
});