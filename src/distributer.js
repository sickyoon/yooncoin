const assert = require('assert');
const { pad, supply } = require('./helpers');

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
        assert(await this.instances.erc20.methods.totalSupply().call() === supply.erc20.total.toString());
        assert(await this.instances.erc20.methods.balanceOf(this.accounts[0]).call() === supply.erc20.total.toString(), `accounts[0] erc20 balance is not ${supply.erc20.total}`);
        assert(await this.instances.erc20.methods.balanceOf(this.accounts[1]).call() === '0', 'accounts[1] erc20 balance is not 0');
        assert(await this.instances.erc20.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === '0', 'accounts[0] router approval not 0');
        assert(await this.instances.erc20.methods.allowance(this.accounts[1], this.instances.router.options.address).call() === '0', 'accounts[1] router approval not 0');

        // approve erc20 on accounts[0] to router
        console.log(`* approve ${supply.erc20.router} erc20 on accounts[0] to router`);
        await this.instances.erc20.methods
            .approve(this.instances.router.options.address, supply.erc20.router)
            .send({
                from: this.accounts[0],
            });

        assert(await this.instances.erc20.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === supply.erc20.router.toString(), `accounts[0] router approval not ${supply.erc20.router}`);

        // approve erc20 on accounts[0] to accounts[1]
        console.log(`* approve ${supply.erc20.account1} erc20 on accounts[0] to accounts[1]`);
        await this.instances.erc20.methods.approve(this.accounts[1], supply.erc20.account1).send({
            from: this.accounts[0],
        });

        assert(await this.instances.erc20.methods.allowance(this.accounts[0], this.accounts[1]).call() === supply.erc20.account1.toString(), `accounts[1] allowance on accounts[0] not ${supply.erc20.account1}`);

        // transfer erc20 from accounts[0] to acconts[1] using accounts[1]
        console.log(`* transfer ${supply.erc20.account1} erc20 from accounts[0] to accounts[1] as accounts[1]`);
        await this.instances.erc20.methods.transferFrom(this.accounts[0], this.accounts[1], supply.erc20.account1).send({
            from: this.accounts[1],
        });

        assert(await this.instances.erc20.methods.allowance(this.accounts[0], this.accounts[1]).call() === '0', 'erc20 - accounts[1] allowance on accounts[0] not 0');
        assert(await this.instances.erc20.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === supply.erc20.router.toString(), `router allowance on accounts[0] not ${supply.erc20.router}`);
        assert(await this.instances.erc20.methods.balanceOf(this.accounts[0]).call() === (supply.erc20.total - supply.erc20.account1).toString(), `accounts[0] erc20 balance is not ${(supply.erc20.total - supply.erc20.account1)}`);
        assert(await this.instances.erc20.methods.balanceOf(this.accounts[1]).call() === supply.erc20.account1.toString(), `accounts[1] erc20 balance is not ${supply.erc20.account1}`);

        // ensure initial weth balances
        console.log("* ensuring initial weth token state");
        assert(await this.instances.weth.methods.totalSupply().call() === '0');
        assert(await this.instances.weth.methods.balanceOf(this.accounts[0]).call() === '0', 'weth - accounts[0] balance is not 0');
        assert(await this.instances.weth.methods.balanceOf(this.accounts[1]).call() === '0', 'weth - accounts[1] balance is not 0');
        assert(await this.instances.weth.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === '0', 'weth - router allowance on accounts[0] not 0');
        assert(await this.instances.weth.methods.allowance(this.accounts[1], this.instances.router.options.address).call() === '0', 'weth - router allowance on accounts[1] not 0');

        // mint weth
        console.log('* mint weth to accounts[0]');
        await this.instances.weth.methods.deposit().send({
            from: this.accounts[0],
            value: supply.weth.total,
        });

        assert(await this.instances.weth.methods.balanceOf(this.accounts[0]).call() === supply.weth.total.toString(), `weth - accounts[0] balance is not ${supply.weth.total}`);
        assert(await this.instances.weth.methods.balanceOf(this.accounts[1]).call() === '0', 'weth - accounts[1] balance is not 0');

        // approve weth on accounts[0] to router
        console.log(`* approve ${supply.weth.router} weth on accounts[0] to router`);
        await this.instances.weth.methods
            .approve(this.instances.router.options.address, supply.weth.router)
            .send({
                from: this.accounts[0],
            });

        assert(await this.instances.weth.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === supply.weth.router.toString(), `weth - router allowance on accounts[0] not ${supply.weth.router}`);

        // approve weth on accounts[0] to accounts[1]
        console.log(`* approve ${supply.weth.account1} weth on accounts[0] to accounts[1]`);
        await this.instances.weth.methods.approve(this.accounts[1], supply.weth.account1).send({
            from: this.accounts[0],
        });

        assert(await this.instances.weth.methods.allowance(this.accounts[0], this.accounts[1]).call() === supply.weth.account1.toString(), `weth - accounts[1] allowance on accounts[0] not ${supply.weth.account1}`);

        // transfer weth from accounts[0] to acconts[1] using accounts[1]
        console.log(`* transfer ${supply.weth.account1} weth from accounts[0] to accounts[1] using accounts[1]`);
        await this.instances.weth.methods.transferFrom(this.accounts[0], this.accounts[1], supply.weth.account1).send({
            from: this.accounts[1],
        });

        assert(await this.instances.weth.methods.allowance(this.accounts[0], this.accounts[1]).call() === '0', 'weth - accounts[1] allowance on accounts[0] not 0');
        assert(await this.instances.weth.methods.allowance(this.accounts[0], this.instances.router.options.address).call() === supply.weth.router.toString(), `weth - router allowance on accounts[0] not ${supply.weth.router}`);
        assert(await this.instances.weth.methods.balanceOf(this.accounts[0]).call() === (supply.weth.total - supply.weth.account1).toString(), `weth - accounts[0] balance is not ${supply.weth.total - supply.weth.account1}`);
        assert(await this.instances.weth.methods.balanceOf(this.accounts[1]).call() === supply.weth.account1.toString(), `weth - accounts[1] balance is not ${supply.weth.account1}`);

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
