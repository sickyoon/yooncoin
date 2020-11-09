
// zero address
const addr0 = '0x0000000000000000000000000000000000000000';

// default tx options
const defaultTxOp = {
    gas: '6721975',
    gasPrice: '100000000000',
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
};
