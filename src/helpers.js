const Web3 = require('web3');

// zero address
const addr0 = '0x0000000000000000000000000000000000000000';

// default tx options
const defaultTxOp = {
    gas: '6721975',
    gasPrice: '100000000000',
}

// TODO: needs to supply min 50,000,000 tokens ??
const supply = {
    erc20: {
        total: Web3.utils.toBN(100000000),
        router: Web3.utils.toBN(50000000),
        account1: Web3.utils.toBN(30000000),
    },
    weth: {
        total: Web3.utils.toBN(100000000),
        router: Web3.utils.toBN(50000000),
        account1: Web3.utils.toBN(30000000),
    },
}

// helper print method
const pad = (str) => {
    let pad = '               ';
    padLeft = false;
    if (typeof str === 'undefined')
        return pad;
    if (padLeft) {
        return (pad + str).slice(-pad.length);
    } else {
        return (str + pad).substring(0, pad.length);
    }
}

module.exports = {
    pad: pad,
    addr0: addr0,
    defaultTxOp: defaultTxOp,
    supply: supply,
};
