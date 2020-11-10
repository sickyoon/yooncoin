const { getAddress, keccak256, solidityPack } = require("ethers/utils");
const { MaxUint256 } = require("ethers/constants");
const assert = require("assert");
const { addr0, defaultTxOp } = require("./helpers");
const UniswapV2Pair = require("@uniswap/v2-core/build/UniswapV2Pair.json");
const IUniswapV2Pair = require("@uniswap/v2-core/build/IUniswapV2Pair.json");
const Web3 = require("web3");

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
    assert(
      (await this.instances.factory.methods
        .getPair(
          this.instances.erc20.options.address,
          this.instances.weth.options.address
        )
        .call()) === addr0,
      "factory pair exists"
    );

    // // calculate token pair address
    // let expectedPairAddr = await this.instances.library.methods.pairFor(
    //     this.instances.factory.options.address,
    //     this.instances.erc20.options.address,
    //     this.instances.weth.options.address,
    // ).call();
    // console.log(expectedPairAddr);

    // create pair
    await this.instances.factory.methods
      .createPair(
        this.instances.erc20.options.address,
        this.instances.weth.options.address
      )
      .send({
        ...defaultTxOp,
        from: this.accounts[0],
      });

    // load pair -> expect non-zero address
    let pairAddr = await this.instances.factory.methods
      .getPair(
        this.instances.erc20.options.address,
        this.instances.weth.options.address
      )
      .call();
    assert(pairAddr !== addr0, "factory pair does not exist");

    console.log(`pair address: ${pairAddr}`);

    const create2 = getCreate2Address(
      this.instances.factory.options.address,
      [
        this.instances.erc20.options.address,
        this.instances.weth.options.address,
      ],
      `0x${UniswapV2Pair.evm.bytecode.object}`
    );

    console.log("create2", create2);

    // assert(
    //   (await this.instances.erc20.methods
    //     .allowance(this.accounts[0], this.instances.router.options.address)
    //     .call()) === "400",
    //   "erc20 - router allowance on accounts[0] not 400"
    // );
    // assert(
    //   (await this.instances.erc20.methods
    //     .allowance(this.accounts[1], this.instances.router.options.address)
    //     .call()) === "0",
    //   "erc20 - router allowance on accounts[1] not 0"
    // );
    // assert(
    //   (await this.instances.weth.methods
    //     .allowance(this.accounts[0], this.instances.router.options.address)
    //     .call()) === "400",
    //   "weth - router allowance on accounts[0] not 400"
    // );
    // assert(
    //   (await this.instances.weth.methods
    //     .allowance(this.accounts[1], this.instances.router.options.address)
    //     .call()) === "0",
    //   "weth - router allowance on accounts[1] not 0"
    // );

    console.log("Router:", this.instances.router.options.address);
    const approval1 = await this.instances.erc20.methods
      .allowance(this.accounts[0], this.instances.router.options.address)
      .call();
    console.log("approval1", approval1);

    const approval2 = await this.instances.weth.methods
      .allowance(this.accounts[0], this.instances.router.options.address)
      .call();
    console.log("approval2", approval2);

    // addLiquidity
    await this.instances.router.methods
      .addLiquidity(
        this.instances.erc20.options.address, // tokenA
        this.instances.weth.options.address, // tokenB
        10000000, // amountADesired
        10000000, // amountBDesired
        100, // amountAMin
        100, // amountBMin
        this.accounts[0], // to address for the fee
        // this.deadline.getTime() // deadline
        MaxUint256
      )
      .send({
        from: this.accounts[0],
        gasLimit: 999999,
      });

    const web3 = new Web3(
      new Web3.providers.WebsocketProvider(`http://127.0.0.1:8545`)
    );
    var myContractInstance = new web3.eth.Contract(
      IUniswapV2Pair.abi,
      pairAddr
    );
    const LPbalance = await myContractInstance.methods
      .balanceOf(this.accounts[0])
      .call();

    console.log("LPbalance", LPbalance);
  };
}

module.exports = UniRunner;

function getCreate2Address(factoryAddress, [tokenA, tokenB], bytecode) {
  const [token0, token1] =
    tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];
  const create2Inputs = [
    "0xff",
    factoryAddress,
    keccak256(solidityPack(["address", "address"], [token0, token1])),
    keccak256(bytecode),
  ];
  const sanitizedInputs = `0x${create2Inputs.map((i) => i.slice(2)).join("")}`;
  return getAddress(`0x${keccak256(sanitizedInputs).slice(-40)}`);
}
