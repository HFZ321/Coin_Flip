const CoinFlip = artifacts.require("./Coinflip_testing");

module.exports = function (deployer) {
  deployer.deploy(CoinFlip);
};
