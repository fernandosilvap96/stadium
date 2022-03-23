const Migrations = artifacts.require("nftWithRoyalties");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
