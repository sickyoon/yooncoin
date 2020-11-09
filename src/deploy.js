const { pad } = require('./helpers');

const ERC20 = require('@uniswap/v2-periphery/build/ERC20.json');
const WETH9 = require('@uniswap/v2-periphery/build/WETH9.json');
const UniswapV2Factory = require('@uniswap/v2-core/build/UniswapV2Factory.json');
const UniswapV2Router02 = require('@uniswap/v2-periphery/build/UniswapV2Router02.json');

// zero address
const addr0 = '0x0000000000000000000000000000000000000000';

// default tx options
const defaultTxOp = {
    gas: '6721975',
    gasPrice: '100000000000',
}

let web3 = null;
let accounts = null;

const deployAll = async (
    web3In,
    accountsIn,
) => {
    console.log('-------------------- deploying --------------------');
    web3 = web3In;
    accounts = accountsIn;

    let instances = {};

    // deploy uniswap ERC20 test token
    instances.erc20 = await deploy(ERC20.abi, ERC20.bytecode, [1000]);
    await subERC20(instances.erc20);

    // deploy uniswap WETH9 test token
    instances.weth = await deploy(WETH9.abi, WETH9.bytecode);
    await subERC20(instances.weth);

    // deploy uniswap factory
    instances.factory = await deploy(UniswapV2Factory.abi, UniswapV2Factory.bytecode, [addr0]);
    await subFactory(instances.factory);

    // deploy uniswap router02
    instances.router = await deploy(UniswapV2Router02.abi, UniswapV2Router02.bytecode, [
        instances.factory.options.address,
        instances.weth.options.address,
    ]);

    // debug print
    for (const instance in instances) {
        console.log(`${pad(instance)} ${instances[instance].options.address}`);
    }

    return instances;
}

const deploy = async (abi, bytecode, args = []) => {
    let contract = new web3.eth.Contract(abi, {
        from: accounts[0],
        data: bytecode,
    });
    let instance = await contract.deploy({
        arguments: args,
    }).send({
        ...defaultTxOp,
        from: accounts[0],
    });
    return instance;
}

// subscribe to standard erc20 events (Transfer, Approval)
const subERC20 = async (instance) => {
    instance.events.Approval({}, (err, evt) => {
        console.log(evt);
    });
    instance.events.Transfer({}, (err, evt) => {
        console.log(evt);
    });
}

// subscribe to factory events (PairCreated)
const subFactory = async (instance) => {
    let t = instance.events.PairCreated({}, (err, evt) => {
        console.log(evt);
    });
}

module.exports = deployAll;
