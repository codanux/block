var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');

exports.web3 = web3

const topicEvent = function (topics) {
    if (topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && topics.length === 3) {
        // ERC20 Transfer
        return {
            name: "Transfer",
            type: "event",
            standard: 'ERC20',
            inputs: [
                {
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ]
        }
    }
    else if (topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && topics.length === 4) {
        // ERC721 Transfer
        return {
            name: "Transfer",
            type: "event",
            standard: 'ERC721',
            inputs: [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ]
        }
    }
    else if (topics[0] === '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62') {
        return {
            name: "TransferSingle",
            type: "event",
            standard: 'ERC1155',
            inputs: [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ]
        }
    }
    else if (topics[0] === '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb') {
        return {
            name: "TransferBatch",
            type: "event",
            standard: 'ERC1155',
            inputs: [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256[]",
                    "name": "ids",
                    "type": "uint256[]"
                },
                {
                    "indexed": false,
                    "internalType": "uint256[]",
                    "name": "values",
                    "type": "uint256[]"
                }
            ]
        }
    }
    else if (topics[0] === '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb') {
        return {
            "standard": 'ERC721',
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        }
    }
    return null
}
exports.topicEvent = topicEvent

exports.blockReceipts = function (blockNumber, topics = []) {
    return new Promise(async (resolve, reject) => {
        const block = await web3.eth.getBlock(blockNumber, true).catch(reject);
        let logs = await web3.eth.getPastLogs({
            fromBlock: blockNumber,
            toBlock: blockNumber,
            topics
        }).catch(reject);
        if (logs) {
            block.transactions = block.transactions.map(transaction => {
                transaction.logs = logs.filter(log => log.transactionHash === transaction.hash).map(log => {
                    const event = topicEvent(log.topics);
                    if (event) {
                        log.topics.shift()
                        log.args = web3.eth.abi.decodeLog(event.inputs, log.data, log.topics);
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

        resolve(block)
    })
}
