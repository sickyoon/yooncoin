
const YoonCoin = artifacts.require("YoonCoin");
// const LiquidityValueCalculator = artifacts.require("LiquidityValueCalculator");

// truffle contract wrapper
const contract = require("@truffle/contract");

// zero address
const addr0 = '0x0000000000000000000000000000000000000000';

// deploy test weth9 from uniswap
// const wethArtifact = require('@uniswap/v2-periphery/build/WETH9.json');
// const weth = contract(wethArtifact);

// advanced weth
// https://github.com/Uniswap/advanced-weth
// const advancedWethArtifact = require('advanced-weth/build/contracts/AdvancedWETH.json');
// const advancedWeth = contract(advancedWethArtifact);
// advancedWeth.setProvider(deployer.provider);
//   deployer.deploy(advancedWeth, accounts[0], { from: accounts[0] });

// canonical weth
// const wethArtifact = require('canonical-weth/build/contracts/WETH9.json');
// const weth = contract(wethArtifact);
// weth.setProvider(deployer.provider);
// deployer.deploy(weth, { from: accounts[0] });

module.exports = function (deployer, network, accounts) {
  deployer.deploy(YoonCoin, "YoonCoin", "YOON");
};
