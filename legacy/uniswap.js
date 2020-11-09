// truffle external script that deploys smart contracts
// and test uniswap functionalities
// truffle exec ./scripts/uniswap.js

const assert = require('assert');
const Web3 = require('web3');
const ganache = require('ganache-core');
const YoonCoin = require('../build/contracts/YoonCoin.json');
const WETH9 = require('@uniswap/v2-periphery/build/WETH9.json');
const UniswapV2Factory = require('@uniswap/v2-core/build/UniswapV2Factory.json');
const UniswapV2Router02 = require('@uniswap/v2-periphery/build/UniswapV2Router02.json');
const ERC20 = require('@uniswap/v2-periphery/build/ERC20.json');

// zero address
const addr0 = '0x0000000000000000000000000000000000000000';

// default tx gas options
const defaultTxOp = {
    gas: '6721975',
    gasPrice: '100000000000',
}

// global accounts
const accounts = [];

// global contract instances
const instances = {}

// deploy all contracts
const deploy = async () => {

    console.log('-------------------- DEPLOYING --------------------')

    // deploy YoonCoin
    // let yoonContract = new web3.eth.Contract(YoonCoin.abi, {
    //     from: accounts[0],
    //     data: YoonCoin.bytecode
    // });
    // instances.yoon = await yoonContract.deploy({
    //     arguments: ["YoonCoin", "YOON"],
    // }).send({
    //     ...defaultTxOp,
    //     ...{ from: accounts[0] },
    // });

    // deploy ERC20
    let erc20Contract = new web3.eth.Contract(ERC20.abi, {
        from: accounts[0],
        data: ERC20.bytecode,
    });
    instances.erc20 = await erc20Contract.deploy({
        arguments: [1000],
    }).send({
        ...defaultTxOp,
        ...{ from: accounts[0] },
    });

    // deploy WETH9
    instances.weth = await (new web3.eth.Contract(WETH9.abi, {
        from: accounts[0],
        data: WETH9.bytecode
    })).deploy({
    }).send({
        ...defaultTxOp,
        ...{ from: accounts[0] },
    });

    // deploy UniswapV2Factory
    instances.factory = await (new web3.eth.Contract(UniswapV2Factory.abi, {
        from: accounts[0],
        data: UniswapV2Factory.bytecode,
    })).deploy({
        arguments: [addr0],
    }).send({
        ...defaultTxOp,
        ...{ from: accounts[0] },
    });

    // TODO: listen to events from factory

    // deploy router02
    instances.router = await (new web3.eth.Contract(UniswapV2Router02.abi, {
        from: accounts[0],
        data: UniswapV2Router02.bytecode,
    })).deploy({
        arguments: [
            instances.factory.options.address,
            instances.weth.options.address,
        ],
    }).send({
        ...defaultTxOp,
        ...{ from: accounts[0] },
    });

    // pairs are deployed by factory

    for (const instance in instances) {
        console.log(`${pad(instance)} ${instances[instance].options.address}`);
    }
}

// subscribe to events
const subscribe = async () => {
    // ERC20 -> Transfer, Approval
    // Factory -> PairCreated

    instances.erc20.events.Approval({}, (err, evt) => {
        console.log('ERC20 Approval EVENT');
        console.log(err);
        console.log(evt);
    }).on('data', (evt) => {
        console.log(evt);
    });
}

// const unsubscribe = async () => {
//     subscription.unsubscribe((err, success) => {
//         if (success)
//             console.log('successfully unsubscribed');
//     });
// web3.eth.clearSubscriptions();
// }

// distribute coins
const distribute = async () => {

    console.log('-------------------- DISTRIBUTING --------------------')

    // distribute yoon coin
    // await instances.yoon.methods.mint(accounts[0], 538).send({
    //     from: accounts[0],
    // });
    // await instances.yoon.methods.transfer(accounts[1], 340).send({
    //     from: accounts[0],
    // });
    // await instances.yoon.methods.approve(instances.router.options.address, 100).send({
    //     from: accounts[0],
    // });
    // await instances.yoon.methods.approve(instances.router.options.address, 100).send({
    //     from: accounts[1],
    // });
    // console.log('YoonCoin');
    // console.log(`${pad('total supply')} ${await instances.yoon.methods.totalSupply().call()}`);
    // console.log(`${pad('acc0 balance')} ${await instances.yoon.methods.balanceOf(accounts[0]).call()}`);
    // console.log(`${pad('acc0 delegated')} ${await instances.yoon.methods.allowance(accounts[0], instances.router.options.address).call()}`);
    // console.log(`${pad('acc1 balance')} ${await instances.yoon.methods.balanceOf(accounts[1]).call()}`);
    // console.log(`${pad('acc1 balance')} ${await instances.yoon.methods.allowance(accounts[1], instances.router.options.address).call()}`);

    // distribute erc20 coin
    await instances.erc20.methods.transfer(accounts[1], 300).send({
        from: accounts[0],
    });
    await instances.erc20.methods.approve(instances.router.options.address, 100).send({
        from: accounts[0],
    });
    await instances.erc20.methods.approve(instances.router.options.address, 100).send({
        from: accounts[1],
    });
    console.log('- ERC20 token stats - ')
    console.log(`${pad('total supply')} ${await instances.erc20.methods.totalSupply().call()}`);
    console.log(`${pad('acc0 balance')} ${await instances.erc20.methods.balanceOf(accounts[0]).call()}`);
    console.log(`${pad('acc0 delegated')} ${await instances.erc20.methods.allowance(accounts[0], instances.router.options.address).call()}`);
    console.log(`${pad('acc1 balance')} ${await instances.erc20.methods.balanceOf(accounts[1]).call()}`);
    console.log(`${pad('acc1 balance')} ${await instances.erc20.methods.allowance(accounts[1], instances.router.options.address).call()}`);

    // distribute weth
    await instances.weth.methods.deposit().send({
        from: accounts[0],
        value: 340,
    });
    await instances.weth.methods.transfer(accounts[1], 120).send({
        from: accounts[0],
    });
    await instances.weth.methods.approve(instances.router.options.address, 100).send({
        from: accounts[0],
    });
    await instances.weth.methods.approve(instances.router.options.address, 100).send({
        from: accounts[1],
    });
    console.log('- WETH9 stats - ');
    console.log(`${pad('total supply')} ${await instances.weth.methods.totalSupply().call()}`);
    console.log(`${pad('acc0 balance')} ${await instances.weth.methods.balanceOf(accounts[0]).call()}`);
    console.log(`${pad('acc0 delegated')} ${await instances.weth.methods.allowance(accounts[0], instances.router.options.address).call()}`);
    console.log(`${pad('acc1 balance')} ${await instances.weth.methods.balanceOf(accounts[1]).call()}`);
    console.log(`${pad('acc1 balance')} ${await instances.weth.methods.allowance(accounts[1], instances.router.options.address).call()}`);
}

// setup uniswap pair
const setupUniswap = async () => {

    console.log('-------------------- SETTING UP UNISWAP --------------------')

    // validate router address
    assert(await instances.router.methods.factory().call() == instances.factory.options.address, 'router factory address mismatch');
    assert(await instances.router.methods.WETH().call() == instances.weth.options.address, 'router weth address mismatch');

    console.log(`number of pairs: ${await instances.factory.methods.allPairsLength().call()}`);

    // set deadline to 1 hour later
    let deadline = new Date();
    deadline.setDate(deadline.getDate() + 1);

    // create pair
    await instances.factory.methods.createPair(
        instances.erc20.options.address,
        instances.weth.options.address,
    ).send({
        ...defaultTxOp,
        from: accounts[0],
    });

    // load pair from factory
    let pairAddrFromFactory = await instances.factory.methods.getPair(
        instances.erc20.options.address,
        instances.weth.options.address,
    ).call();
    console.log(`${pad('pair addr')} ${pairAddrFromFactory}`);

    // let [amountA, amountB, liquidity] = await instances.router.methods.addLiquidity(
    //     instances.erc20.options.address, // tokenA
    //     instances.weth.options.address, // tokenB
    //     10, // amountADesired
    //     10, // amountBDesired
    //     10, // amountAMin
    //     10, // amountBMin
    //     accounts[0], // to address for the fee
    //     deadline.getTime(), // deadline
    // ).send({
    //     from: accounts[0],
    // });

}

module.exports = async function (callback) {

    try {

        // start ganache server
        const port = 8545;
        const server = ganache.server();
        server.listen(port, (err, blockchain) => {

        });
        web3.setProvider(ganache.provider());

        // override truffle provider
        // let wsProvider = new Web3.providers.HttpProvider('http://localhost:8545');
        // web3.setProvider(wsProvider);
        // console.log(web3);

        // set global accounts
        (await web3.eth.getAccounts()).forEach((account) => { accounts.push(account) });
        console.log(accounts);

        // deploy contracts
        await deploy();

        // subscribe to events
        await subscribe();

        // distribute coins
        await distribute();

        // uniswap pair
        await setupUniswap();

    } catch (err) {
        console.log(err.message);
        callback(err);
    }
    callback(null);
}

function pad(str) {
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