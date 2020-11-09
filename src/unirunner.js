const assert = require('assert');
const { addr0, defaultTxOp } = require('./helpers');

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

        // // calculate token pair address
        // let expectedPairAddr = await this.instances.library.methods.pairFor(
        //     this.instances.factory.options.address,
        //     this.instances.erc20.options.address,
        //     this.instances.weth.options.address,
        // ).call();
        // console.log(expectedPairAddr);

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

        assert(await this.instances.erc20.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === '400', 'erc20 - router allowance on accounts[0] not 400');
        assert(await this.instances.erc20.methods.allowance(this.accounts[1], this.instances.router.options.address).call() === '0', 'erc20 - router allowance on accounts[1] not 0');
        assert(await this.instances.weth.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === '400', 'weth - router allowance on accounts[0] not 400');
        assert(await this.instances.weth.methods.allowance(this.accounts[1], this.instances.router.options.address).call() === '0', 'weth - router allowance on accounts[1] not 0');

        // addLiquidity
        // let [amountA, amountB, liquidity] = 
        await this.instances.router.methods.addLiquidity(
            this.instances.erc20.options.address, // tokenA
            this.instances.weth.options.address, // tokenB
            10, // amountADesired
            10, // amountBDesired
            10, // amountAMin
            10, // amountBMin
            this.accounts[0], // to address for the fee
            this.deadline.getTime(), // deadline
        ).send({
            from: this.accounts[0],
        });
    }






}

module.exports = UniRunner;
