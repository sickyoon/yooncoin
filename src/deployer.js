const { pad, addr0, defaultTxOp } = require('./helpers');
const ERC20 = require('@uniswap/v2-periphery/build/ERC20.json');
const WETH9 = require('@uniswap/v2-periphery/build/WETH9.json');
const UniswapV2Factory = require('@uniswap/v2-core/build/UniswapV2Factory.json');
const UniswapV2Router02 = require('@uniswap/v2-periphery/build/UniswapV2Router02.json');

// smart contract deployer
class Deployer {

    web3;
    accounts;

    instances = {};

    constructor(web3, accounts) {
        this.web3 = web3;
        this.accounts = accounts;
    }

    // deploy all smart contracts
    deployAll = async () => {
        console.log('-------------------- deploying --------------------');

        // deploy uniswap ERC20 test token
        this.instances.erc20 = await this.deploy(ERC20.abi, ERC20.bytecode, [1000]);

        // deploy uniswap WETH9 test token
        this.instances.weth = await this.deploy(WETH9.abi, WETH9.bytecode);

        // deploy uniswap factory
        this.instances.factory = await this.deploy(UniswapV2Factory.abi, UniswapV2Factory.bytecode, [addr0]);

        // deploy uniswap router02
        this.instances.router = await this.deploy(UniswapV2Router02.abi, UniswapV2Router02.bytecode, [
            this.instances.factory.options.address,
            this.instances.weth.options.address,
        ]);
    }

    subscribeAll = async () => {
        // await this.subERC20(this.instances.erc20);
        // await this.subERC20(this.instances.weth);
        // await this.subFactory(this.instances.factory);
    }

    // deploy a single smart contract
    deploy = async (abi, bytecode, args = []) => {
        let contract = new this.web3.eth.Contract(abi, {
            from: this.accounts[0],
            data: bytecode,
        });
        let instance = await contract.deploy({
            arguments: args,
        }).send({
            ...defaultTxOp,
            from: this.accounts[0],
        });
        return instance;
    }

    // subscribe to standard erc20 events (Transfer, Approval)
    subERC20 = async (instance) => {
        instance.events.Approval({}, (err, evt) => {
            console.log(evt);
        });
        instance.events.Transfer({}, (err, evt) => {
            console.log(evt);
        });
    }

    // subscribe to factory events (PairCreated)
    subFactory = async (instance) => {
        instance.events.PairCreated({}, (err, evt) => {
            console.log(evt);
        });
    }

    // debug print
    print = () => {
        for (const instance in this.instances) {
            console.log(`${pad(instance)} ${this.instances[instance].options.address}`);
        }
    }

}

module.exports = Deployer;
