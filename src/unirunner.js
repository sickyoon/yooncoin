const assert = require('assert');
const { addr0, defaultTxOp, supply } = require('./helpers');
const IUniswapV2Pair = require('@uniswap/v2-core/build/IUniswapV2Pair.json');

class UniRunner {
    web3;
    accounts;
    instances;
    deadline = new Date();

    constructor(web3, accounts, instances) {
        this.web3 = web3;
        this.accounts = accounts;
        this.instances = instances;
        // set deadline to 2 days later
        this.deadline.setDate(this.deadline.getDate() + 2);
    }

    run = async () => {

        // load pair -> expecte zero address
        assert(await this.instances.factory.methods.getPair(
            this.instances.erc20.options.address,
            this.instances.weth.options.address,
        ).call() === addr0, 'factory pair exists');

        // create pair
        await this.instances.factory.methods.createPair(
            this.instances.erc20.options.address,
            this.instances.weth.options.address,
        ).send({
            ...defaultTxOp,
            from: this.accounts[0],
        });

        // load pair -> expect non-zero address
        let pairAddr = await this.instances.factory.methods.getPair(
            this.instances.erc20.options.address,
            this.instances.weth.options.address,
        ).call();
        assert(pairAddr !== addr0, 'factory pair does not exist');

        console.log(`pair address: ${pairAddr}`);

        assert(await this.instances.erc20.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === supply.erc20.router.toString(), `erc20 - router allowance on accounts[0] not ${supply.erc20.router}`);
        assert(await this.instances.erc20.methods.allowance(this.accounts[1], this.instances.router.options.address).call() === '0', 'erc20 - router allowance on accounts[1] not 0');
        assert(await this.instances.weth.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === supply.weth.router.toString(), `weth - router allowance on accounts[0] not ${supply.weth.router}`);
        assert(await this.instances.weth.methods.allowance(this.accounts[1], this.instances.router.options.address).call() === '0', 'weth - router allowance on accounts[1] not 0');

        // addLiquidity
        // let [amountA, amountB, liquidity] = 
        // can't return values here because transactions are mined asynchronously
        // 1000 is burned (min liquidity)
        await this.instances.router.methods
            .addLiquidity(
                this.instances.erc20.options.address, // tokenA
                this.instances.weth.options.address, // tokenB
                50, // amountADesired
                50000, // amountBDesired
                100, // amountAMin
                100, // amountBMin
                this.accounts[0], // to address for the fee
                this.deadline.getTime(), // deadline
            ).send({
                ...defaultTxOp,
                from: this.accounts[0],
            });

        // get pair
        let retrievedPairAddr = await this.instances.factory.methods.getPair(
            this.instances.erc20.options.address,
            this.instances.weth.options.address
        ).call();
        assert(retrievedPairAddr == pairAddr, 'retrieved pair address mismatch');

        let pairInstance = new this.web3.eth.Contract(IUniswapV2Pair.abi, pairAddr);
        assert(await pairInstance.methods.factory().call() === await this.instances.factory.options.address, 'pair factory address mismatch');
        // assert(await pairInstance.methods.token0().call() === this.instances.erc20.options.address, 'pair erc20 address mismatch');
        // assert(await pairInstance.methods.token1().call() === this.instances.weth.options.address, 'pair weth address mismatch');

        console.log(`min liquidity: ${await pairInstance.methods.MINIMUM_LIQUIDITY().call()}`);

        let { reserve0, reserve1, blockTimestampLast } = await pairInstance.methods.getReserves().call();
        console.log(`reserve0: ${reserve0}, reserve1: ${reserve1}, blockTimestampLast: ${blockTimestampLast}`);

        let balance0 = await pairInstance.methods.balanceOf(this.accounts[0]).call();
        console.log(`balance owned by account0: ${balance0}`);

        let balance1 = await pairInstance.methods.balanceOf(this.accounts[1]).call();
        console.log(`balance owned by account1: ${balance1}`);


    }

}

module.exports = UniRunner;
