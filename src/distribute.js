const { pad } = require('./helpers');

let web3 = null;
let accounts = null;
let instances = null;

// mint and distribute coins
const distribute = async (
    web3In,
    accountsIn,
    instancesIn,
) => {
    console.log('-------------------- distributing --------------------');
    web3 = web3In;
    accounts = accountsIn;
    instances = instancesIn;

    // initial state
    await debugPrint(instances.erc20);
    await debugPrint(instances.weth);

    // after minting & distributing

    // after approving

}

// print stats on a given token
const debugPrint = async (instance) => {
    console.log(`----- ${await instance.methods.name().call()} (${await instance.methods.symbol().call()}) -----`);
    console.log(`${pad('total supply')} ${await instance.methods.totalSupply().call()}`);
    console.log(`${pad('acc0')} ${await instance.methods.balanceOf(accounts[0]).call()} (${await instance.methods.allowance(accounts[0], instances.router.options.address).call()})`);
    console.log(`${pad('acc1')} ${await instance.methods.balanceOf(accounts[1]).call()} (${await instance.methods.allowance(accounts[1], instances.router.options.address).call()})`);
}

module.exports = distribute;