// truffle external script that deploys smart contracts
// and test uniswap functionalities
// truffle exec ./scripts/uniswap.js

const contract = require("@truffle/contract");
const YoonCoin = artifacts.require("YoonCoin");
const WETH9 = contract(require('@uniswap/v2-periphery/build/WETH9.json'));
const UniswapV2Factory = contract(require('@uniswap/v2-core/build/UniswapV2Factory.json'));

const IUniswapV2Pair = contract(require('@uniswap/v2-core/build/IUniswapV2Pair.json'));
const IUniswapV2ERC20 = contract(require('@uniswap/v2-core/build/IUniswapV2ERC20.json'));

const UniswapV2Router02 = contract(require('@uniswap/v2-periphery/build/UniswapV2Router02.json'));
const UniswapV2Library = contract(require('@uniswap/v2-periphery/build/UniswapV2Library.json'));

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

// global transactions
const txs = {}

// deploy all contracts
const deploy = async () => {

    console.log('-------------------- DEPLOYING --------------------')

    // deploy YoonCoin
    let yoonContract = new web3.eth.Contract(YoonCoin.abi, {
        from: accounts[0],
        data: YoonCoin.bytecode
    });
    instances.yoon = await yoonContract.deploy({
        arguments: ["YoonCoin", "YOON"],
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
        console.log(`${pad('          ', instance, false)} ${instances[instance].options.address}`);
    }
}

// distribute coins
const distribute = async () => {

    console.log('-------------------- DISTRIBUTING --------------------')

    // distribute yoon coin
    // console.log(`constract addr: ${instances.yoon.options.address} `);
    // console.log(`name: ${await instances.yoon.methods.name().call()}`);
    // console.log(`symbol: ${await instances.yoon.methods.symbol().call()}`);
    // console.log(`minter: ${await instances.yoon.methods.minter().call()}`);
    await instances.yoon.methods.mint(accounts[0], 538).send({
        from: accounts[0],
    });
    await instances.yoon.methods.transfer(accounts[1], 340).send({
        from: accounts[0],
    });
    console.log(`yoon total supply: ${await instances.yoon.methods.totalSupply().call()}`);
    console.log(`yoon account 0: ${await instances.yoon.methods.balanceOf(accounts[0]).call()}`);
    console.log(`yoon account 1: ${await instances.yoon.methods.balanceOf(accounts[1]).call()}`);

    // distribute weth
    await instances.weth.methods.deposit().send({
        from: accounts[0],
        value: 340,
    });
    await instances.weth.methods.transfer(accounts[1], 120).send({
        from: accounts[0],
    });
    console.log(`weth total supply: ${await instances.weth.methods.totalSupply().call()}`);
    console.log(`weth account 0: ${await instances.weth.methods.balanceOf(accounts[0]).call()}`);
    console.log(`weth account 1: ${await instances.weth.methods.balanceOf(accounts[1]).call()}`);
}

// setup uniswap pair
const setupUniswap = async () => {

    console.log('-------------------- SETTING UP UNISWAP --------------------')

    // create factory pair
    txs.pair = await instances.factory.methods.createPair(
        instances.yoon.options.address,
        instances.weth.options.address,
    ).send({
        ...defaultTxOp,
        from: accounts[0],
    });
    console.log(`number of pairs: ${await instances.factory.methods.allPairsLength().call()}`);

    // load pair
    let pairAddr = await instances.factory.methods.getPair(
        instances.yoon.options.address,
        instances.weth.options.address,
    ).call();
    let pair = new web3.eth.Contract(IUniswapV2Pair.abi, pairAddr);
    console.log(`pair factory: ${await pair.methods.factory().call()}`);

    // let's try using the router
    console.log('* loading router ...')
    console.log(`factory addr: ${await instances.router.methods.factory().call()}`);
    console.log(`weth addr: ${await instances.router.methods.WETH().call()}`);

    // set to 1 hour later
    let deadline = new Date();
    deadline.setDate(deadline.getDate() + 1);

    // give router an allowance to be able to add liquidity
    console.log('give router an allowance to be able to add liquidity');
    await instances.yoon.methods.approve(
        instances.router.options.address,
        10,
    ).send({
        ...defaultTxOp,
        from: accounts[0],
    })
    await instances.weth.methods.approve(
        instances.router.options.address,
        10,
    ).send({
        ...defaultTxOp,
        from: accounts[0],
    });

    let yoonAllowance = await instances.yoon.methods.allowance(accounts[0], instances.router.options.address).call();
    console.log(`YoonCoin allowance by router: ${yoonAllowance}`);
    let wethAllowance = await instances.weth.methods.allowance(accounts[0], instances.router.options.address).call();
    console.log(`WETH9 allowance: ${wethAllowance}`);

    // add liquidity
    let [amountA, amountB, liquidity] = await instances.router.methods.addLiquidity(
        instances.yoon.options.address, // tokenA
        instances.weth.options.address, // tokenB
        1, // amountADesired
        1, // amountBDesired
        1, // amountAMin
        1, // amountBMin
        accounts[0], // to address for the fee
        deadline.getTime(), // deadline
    ).send({
        from: accounts[0],
    });

    console.log(`A: ${amountA}, B: ${amountB}, liquidity: ${liquidity}`);


    // remove liquidity

    // swapExactTokensForTokens
    // swapExactTokensForTokens(
    //     // amountIn
    //     // amountOut
    //     // addresses
    //     // to address
    //     // deadline
    // )

}

module.exports = async function (callback) {
    try {

        // set global accounts
        (await web3.eth.getAccounts()).forEach((account) => { accounts.push(account) });
        console.log(accounts);

        // deploy contracts
        await deploy();

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

function pad(pad, str, padLeft) {
    if (typeof str === 'undefined')
        return pad;
    if (padLeft) {
        return (pad + str).slice(-pad.length);
    } else {
        return (str + pad).substring(0, pad.length);
    }
}