// truffle external scripts
// truffle exec ./scripts/create_pair.js

const YoonCoin = artifacts.require("YoonCoin");

module.exports = async function (callback) {

    try {

        // includes web3
        // default provider set
        // contracts included as global objects

        // display all accounts
        let accounts = await web3.eth.getAccounts();
        console.log(`accounts: ${accounts}`);

        // get instance of YoonCoin
        let yoonInstance = await YoonCoin.deployed();

        // display info
        console.log(`constract addr: ${yoonInstance.address} `);
        console.log(`name: ${await yoonInstance.name()} `);
        console.log(`symbol: ${await yoonInstance.symbol()} `);
        console.log(`minter: ${await yoonInstance.minter()} `);
        console.log(`total supply: ${(await yoonInstance.totalSupply()).toString()} `);
        console.log(`account 0: ${await yoonInstance.balanceOf(accounts[0])}`);
        console.log(`account 1: ${await yoonInstance.balanceOf(accounts[1])}`);

        // mint money
        console.log('minting ...');
        await yoonInstance.mint(accounts[0], 483);
        await yoonInstance.mint(accounts[1], 49);
        console.log(`total supply: ${(await yoonInstance.totalSupply()).toString()} `);
        console.log(`account 0: ${await yoonInstance.balanceOf(accounts[0])}`);
        console.log(`account 1: ${await yoonInstance.balanceOf(accounts[1])}`);

        console.log('transfering ...');
        await yoonInstance.transfer(accounts[1], 204);
        console.log(`total supply: ${(await yoonInstance.totalSupply()).toString()} `);
        console.log(`account 0: ${await yoonInstance.balanceOf(accounts[0])}`);
        console.log(`account 1: ${await yoonInstance.balanceOf(accounts[1])}`);

        // TODO:

        // deploy WETH9
        // deploy YOONCOIN
        // deploy UniswapV2Factory

        // create pair with factory
        // create liquid pool

    } catch (err) {
        callback(err);
    }
    callback(null);
}