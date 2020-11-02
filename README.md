# YOON coin (ERC20)

## Uniswap Note
https://uniswap.org/docs/v2/protocol-overview/smart-contracts/

* Factory (Core) - creating & indexing coins? create one and only one contract per unique token pair.
* Pairs (Core) - automatic market makers, keeping track of pool token balances
* Periphery - domain-specific interactions with core
* Library - library of functions used for fetching data & pricing
* Router - uses the library to support additional functionalities for frontend

## Testing

* test WETH by wrapping and unwrapping ETH
