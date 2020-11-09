
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
};
