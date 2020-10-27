pragma solidity >=0.4.25 <0.7.5;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/YoonCoin.sol";

contract TestYoonCoin {
    function testInitialBalanceUsingDeployedContract() public {
        YoonCoin meta = YoonCoin(DeployedAddresses.YoonCoin());

        uint256 expected = 10000;

        Assert.equal(
            meta.getBalance(tx.origin),
            expected,
            "Owner should have 10000 YoonCoin initially"
        );
    }

    function testInitialBalanceWithNewYoonCoin() public {
        YoonCoin meta = new YoonCoin();

        uint256 expected = 10000;

        Assert.equal(
            meta.getBalance(tx.origin),
            expected,
            "Owner should have 10000 YoonCoin initially"
        );
    }
}
