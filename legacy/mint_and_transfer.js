// truffle external scripts
// truffle exec ./scripts/create_pair.js
const contract = require("@truffle/contract");
const YoonCoin = artifacts.require("YoonCoin");
const UniswapV2Factory = contract(require('@uniswap/v2-core/build/UniswapV2Factory.json'));

const defaultTxOp = {
    gas: '6721975',
    gasPrice: '100000000000',
}

module.exports = async function (callback) {

    try {

        // includes web3
        // default provider set
        // contracts included as global objects

        // display all accounts
        let accounts = await web3.eth.getAccounts();
        // console.log(accounts);

        // deploy YoonCoin
        // let yoonContract = new web3.eth.Contract(YoonCoin.abi, { from: accounts[0], data: YoonCoin.bytecode });
        // let result = await yoonContract.deploy({
        //     arguments: ["YoonCoin", "YOON"],
        // }).send({
        //     ...defaultTxOp,
        //     ...{ from: accounts[0] },
        // });
        // yoonCoinAddr = result._address;
        // console.log(yoonCoinAddr);


        // deployment ex
        // var contact = web3.eth.contract.new(abi,{from: web3.eth.accounts[0], data: bc});
        // console.log(contract.address); // Prints address



        // get instance of YoonCoin
        // let yoonInstance = await YoonCoin.deployed();

        // // display info
        // console.log(`constract addr: ${yoonInstance.address} `);
        // console.log(`name: ${await yoonInstance.name()} `);
        // console.log(`symbol: ${await yoonInstance.symbol()} `);
        // console.log(`minter: ${await yoonInstance.minter()} `);
        // console.log(`total supply: ${(await yoonInstance.totalSupply()).toString()} `);
        // console.log(`account 0: ${await yoonInstance.balanceOf(accounts[0])}`);
        // console.log(`account 1: ${await yoonInstance.balanceOf(accounts[1])}`);

        // UniswapV2Factory.setProvider(web3.currentProvider)
        // UniswapV2Factory.contractName = 'UniswapV2Factory';
        // let factoryInstance = await UniswapV2Factory.at(factoryAddr);
        // console.log(`uniswap num pairs: ${await factoryInstance.allPairsLength()}`);
        // let pair = await factoryInstance.createPair(yoonInstance.address, wethAddr, { from: accounts[0] });
        // console.log(pair);
        // console.log(`uniswap num pairs: ${await factoryInstance.allPairsLength()}`);

        // mint money
        // console.log('minting ...');
        // await yoonInstance.mint(accounts[0], 483);
        // await yoonInstance.mint(accounts[1], 49);
        // console.log(`total supply: ${(await yoonInstance.totalSupply()).toString()} `);
        // console.log(`account 0: ${await yoonInstance.balanceOf(accounts[0])}`);
        // console.log(`account 1: ${await yoonInstance.balanceOf(accounts[1])}`);

        // console.log('transfering ...');
        // await yoonInstance.transfer(accounts[1], 204);
        // console.log(`total supply: ${(await yoonInstance.totalSupply()).toString()} `);
        // console.log(`account 0: ${await yoonInstance.balanceOf(accounts[0])}`);
        // console.log(`account 1: ${await yoonInstance.balanceOf(accounts[1])}`);

        // create pair with factory


        // create liquid pool

    } catch (err) {
        callback(err);
    }
    callback(null);
}