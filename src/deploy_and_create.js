// ethersjs version of script

const { ethers } = require("ethers");

// provider that defaults to localhost:8545
const provider = new ethers.providers.JsonRpcProvider();

// account signer used to sign transaction to send ether and pay to change states
const signer = provider.getSigner();

async function main() {
    console.log(await provider.getBlockNumber());
}

main().then().catch(err => console.log(err));