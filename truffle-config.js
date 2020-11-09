const Web3 = require('web3');

module.exports = {

  plugins: ["truffle-security"],

  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      // websockets: true,
      // provider: () => new Web3.providers.WebsocketProvider('ws://localhost:8545', {
      //   headers: {
      //     Origin: 'http://localhost'
      //   }
      // }),
    },
    //  test: {
    //    host: "127.0.0.1",
    //    port: 7545,
    //    network_id: "*"
    //  }
  },
  compilers: {
    solc: {
      version: "=0.6.6",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1500
        }
      }
    }
  }
};
