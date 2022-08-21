const Log = require('./log')

module.exports = class {

    constructor(web3) {
        this.web3 = web3
    }

    async receipts(blockNumber, topics = []) {
        let block = await this.web3.eth.getBlock(blockNumber, true)
        let logs = await this.web3.eth.getPastLogs({
            fromBlock: blockNumber,
            toBlock: blockNumber,
            topics
        })

        if (logs) {
            block.transactions = block.transactions.map(transaction => {
                transaction.logs = logs.filter(log => log.transactionHash === transaction.hash).map(log => {
                    const event = Log.decode(log.topics);
                    if (event) {
                        log.topics.shift()
                        log.args = this.web3.eth.abi.decodeLog(event.inputs, log.data, log.topics);
                        log.name = event.name
                        log.type = event.type
                        log.standard = event.standard
                    }
                    return log;
                })
                return transaction;
            })
        }
        block.transactionCount = block.transactions.length
        return block
    }
}
