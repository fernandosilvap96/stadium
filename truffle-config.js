/* TRUFFLE CONFIG 
BSC TESTNET */

const HDWalletProvider = require('@truffle/hdwallet-provider');
const NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker");


const privateKeys = ['9b2808b0cead68ecbe565fa66bd270d8c4c9aa7780a84c06ffad0a9a7fc04aaf'];

const provider = new HDWalletProvider(privateKeys[0], 'https://data-seed-prebsc-1-s1.binance.org:8545/');


module.exports = {

  contracts_build_directory: './frontend/src/build/contracts',

  networks: {
    bscTestnet: {
      provider: () => provider,
      network_id: 97,
      skipDryRun: true
    },
  },
  mocha: {
  },
  compilers: {
    solc: {
      version: "0.8.10",
    }
  },
};
