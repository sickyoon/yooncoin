const YoonCoin = artifacts.require("YoonCoin");

module.exports = function (deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(YoonCoin, "YoonCoin", "YOON");
};
