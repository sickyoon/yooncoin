
const YoonCoin = artifacts.require("YoonCoin");

// truffle contract wrapper
const contract = require("@truffle/contract");

// zero address
const addr0 = '0x0000000000000000000000000000000000000000';

const WETH9 = contract(require('@uniswap/v2-periphery/build/WETH9.json'));
const UniswapV2Factory = contract(require('@uniswap/v2-core/build/UniswapV2Factory.json'));


module.exports = function (deployer, network, accounts) {

  // deploy UniswapV2Factory
  UniswapV2Factory.setProvider(deployer.provider);
  UniswapV2Factory.contractName = 'UniswapV2Factory';
  deployer.deploy(UniswapV2Factory, addr0, { from: accounts[0] });

  // deploy YOON coin
  deployer.deploy(YoonCoin, "YoonCoin", "YOON");

  // deploy WETH coin
  WETH9.setProvider(deployer.provider);
  WETH9.contractName = 'WETH9';
  deployer.deploy(WETH9, { from: accounts[0] });
};
