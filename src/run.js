"use strict";

const ganache = require("ganache-core");
const Web3 = require("web3");
const Deployer = require("./deployer");
const Distributer = require("./distributer");
const UniRunner = require("./unirunner");
const { addr0, defaultTxOp } = require("./helpers");
const port = 8545;

// https://github.com/trufflesuite/ganache-cli
const ganacheConfig = {
  debug: true,
  port: port,
  total_accounts: 2,
  ws: true,
};

// initialize ganache server
const server = ganache.server(ganacheConfig);
server.listen(port, (err, blockchain) => {
  if (err) {
    console.log(err);
  }
});
// ganache.provider(ganacheConfig)

// initialize web3
// const web3 = new Web3(
//   new Web3.providers.WebsocketProvider(`ws://localhost:${port}`)
// );
const web3 = new Web3(
  new Web3.providers.WebsocketProvider(`http://127.0.0.1:8545`)
);

const run = async () => {
  console.log("-------------------- accounts --------------------");
  let accounts = await web3.eth.getAccounts();
  console.log(accounts);

  // deploy contracts and subscribe to events
  let deployer = new Deployer(web3, accounts);
  await deployer.deployAll();
  await deployer.subscribeAll();
  await deployer.print();

  let instances = deployer.instances;

  // mint & distribute tokens
  let distributer = new Distributer(web3, accounts, instances);
  await distributer.distribute();
  await distributer.print();

  // run some uniswap functions
  let unirunner = new UniRunner(web3, accounts, instances);
  await unirunner.run();

  console.log("done");
};

(async () => {
  try {
    await run();
  } catch (e) {
    console.log(e.message);
  }
})();
