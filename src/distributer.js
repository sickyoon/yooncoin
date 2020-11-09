const assert = require('assert');
const { pad } = require('./helpers');

// mint and distribute tokens
class Distributer {
    web3;
    accounts;
    instances;

    constructor(web3, accounts, instances) {
        this.web3 = web3;
        this.accounts = accounts;
        this.instances = instances;
    }

    distribute = async () => {

        console.log('-------------------- distributing --------------------');

        // ensure initial erc20 balances
        console.log("* ensuring initial erc20 token state");
        assert(await this.instances.erc20.methods.totalSupply().call() === '1000');
        assert(await this.instances.erc20.methods.balanceOf(this.accounts[0]).call() === '1000', 'accounts[0] erc20 balance is not 1000');
        assert(await this.instances.erc20.methods.balanceOf(this.accounts[1]).call() === '0', 'accounts[1] erc20 balance is not 0');
        assert(await this.instances.erc20.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === '0', 'accounts[0] router approval not 0');
        assert(await this.instances.erc20.methods.allowance(this.accounts[1], this.instances.router.options.address).call() === '0', 'accounts[1] router approval not 0');

        // approve 400 erc20 on accounts[0] to router
        console.log('* approve 400 erc20 on accounts[0] to router');
        await this.instances.erc20.methods.approve(this.instances.router.options.address, 400).send({
            from: this.accounts[0],
        });

        assert(await this.instances.erc20.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === '400', 'accounts[0] router approval not 400');

        // approve 300 erc20 on accounts[0] to accounts[1]
        console.log('* approve 300 erc20 on accounts[0] to accounts[1]');
        await this.instances.erc20.methods.approve(this.accounts[1], 300).send({
            from: this.accounts[0],
        });

        assert(await this.instances.erc20.methods.allowance(this.accounts[0], this.accounts[1]).call() === '300', 'accounts[1] allowance on accounts[0] not 300');

        // transfer 300 erc20 from accounts[0] to acconts[1] using accounts[1]
        console.log('* transfer 300 erc20 from accounts[0] to accounts[1] as accounts[1]');
        await this.instances.erc20.methods.transferFrom(this.accounts[0], this.accounts[1], 300).send({
            from: this.accounts[1],
        });

        assert(await this.instances.erc20.methods.allowance(this.accounts[0], this.accounts[1]).call() === '0', 'erc20 - accounts[1] allowance on accounts[0] not 0');
        assert(await this.instances.erc20.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === '400', 'router allowance on accounts[0] not 400');
        assert(await this.instances.erc20.methods.balanceOf(this.accounts[0]).call() === '700', 'accounts[0] erc20 balance is not 700');
        assert(await this.instances.erc20.methods.balanceOf(this.accounts[1]).call() === '300', 'accounts[1] erc20 balance is not 300');

        // ensure initial weth balances
        console.log("* ensuring initial weth token state");
        assert(await this.instances.weth.methods.totalSupply().call() === '0');
        assert(await this.instances.weth.methods.balanceOf(this.accounts[0]).call() === '0', 'weth - accounts[0] balance is not 0');
        assert(await this.instances.weth.methods.balanceOf(this.accounts[1]).call() === '0', 'weth - accounts[1] balance is not 0');
        assert(await this.instances.weth.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === '0', 'weth - router allowance on accounts[0] not 0');
        assert(await this.instances.weth.methods.allowance(this.accounts[1], this.instances.router.options.address).call() === '0', 'weth - router allowance on accounts[1] not 0');

        // mint weth
        console.log('* mint 1000 weth to accounts[0]');
        await this.instances.weth.methods.deposit().send({
            from: this.accounts[0],
            value: 1000,
        });

        assert(await this.instances.weth.methods.balanceOf(this.accounts[0]).call() === '1000', 'weth - accounts[0] balance is not 1000');
        assert(await this.instances.weth.methods.balanceOf(this.accounts[1]).call() === '0', 'weth - accounts[1] balance is not 0');

        // approve 400 weth on accounts[0] to router
        console.log('* approve 400 weth on accounts[0] to router');
        await this.instances.weth.methods.approve(this.instances.router.options.address, 400).send({
            from: this.accounts[0],
        });

        assert(await this.instances.weth.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === '400', 'weth - router allowance on accounts[0] not 400');

        // approve 300 weth on accounts[0] to accounts[1]
        console.log('* approve 300 weth on accounts[0] to accounts[1]');
        await this.instances.weth.methods.approve(this.accounts[1], 300).send({
            from: this.accounts[0],
        });

        assert(await this.instances.weth.methods.allowance(this.accounts[0], this.accounts[1]).call() === '300', 'weth - accounts[1] allowance on accounts[0] not 300');

        // transfer 300 from accounts[0] to acconts[1] using router
        // approve should have 100 left afterwards
        console.log('* transfer 300 weth from accounts[0] to accounts[1] using accounts[1]');
        await this.instances.weth.methods.transferFrom(this.accounts[0], this.accounts[1], 300).send({
            from: this.accounts[1],
        });

        assert(await this.instances.weth.methods.allowance(this.accounts[0], this.accounts[1]).call() === '0', 'weth - accounts[1] allowance on accounts[0] not 0');
        assert(await this.instances.weth.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === '400', 'weth - router allowance on accounts[0] not 400');
        assert(await this.instances.weth.methods.balanceOf(this.accounts[0]).call() === '700', 'weth - accounts[0] balance is not 700');
        assert(await this.instances.weth.methods.balanceOf(this.accounts[1]).call() === '300', 'weth - accounts[1] balance is not 300');

    }

    print = async () => {
        await this.printInstance(this.instances.erc20);
        await this.printInstance(this.instances.weth);
    }

    printInstance = async (instance) => {
        console.log(`* ${await instance.methods.name().call()} (${await instance.methods.symbol().call()})`);
        console.log(`  ${pad('total')} ${await instance.methods.totalSupply().call()}`);
        console.log(`  ${pad('acc0')} ${await instance.methods.balanceOf(this.accounts[0]).call()} (${await instance.methods.allowance(this.accounts[0], this.instances.router.options.address).call()})`);
        console.log(`  ${pad('acc1')} ${await instance.methods.balanceOf(this.accounts[1]).call()} (${await instance.methods.allowance(this.accounts[1], this.instances.router.options.address).call()})`);
    }
}

module.exports = Distributer;
