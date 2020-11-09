
const ganache = require('ganache-core');
const Web3 = require('web3');
const deployAll = require('./deploy');
const distribute = require('./distribute');
const port = 8545;

// https://github.com/trufflesuite/ganache-cli
const ganacheConfig = {
    debug: true,
    port: port,
    total_accounts: 2,
    ws: true,
}

// initialize ganache server
const server = ganache.server(ganacheConfig);
server.listen(port, (err, blockchain) => {
    if (err) {
        console.log(err);
    }
});
// ganache.provider(ganacheConfig)

// initialize web3
const web3 = new Web3(new Web3.providers.WebsocketProvider(`ws://localhost:${port}`));

const run = async () => {
    console.log('-------------------- accounts --------------------');
    let accounts = await web3.eth.getAccounts();
    console.log(accounts);

    // deploy contracts and subscribe to events
    let instances = await deployAll(web3, accounts);

    await distribute(web3, accounts, instances);


};

(async () => {
    try {

        await run();

    } catch (e) {
        console.log(e.message);
    }
})();