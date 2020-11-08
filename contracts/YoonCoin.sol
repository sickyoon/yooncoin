// SPDX-License-Identifier: MIT
pragma solidity <0.7.5;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/SafeCast.sol";

contract YoonCoin is IERC20 {
    // essential libraries
    using SafeMath for uint256;
    using SafeCast for uint256;

    // master address who created this contract
    address public minter;

    // balance is mapped to all addresses
    mapping(address => uint256) private _balances;

    // delegated balance -> each address can allocate amount to be used by delegated address
    mapping(address => mapping(address => uint256)) private allowed;

    // global variable? -> where is it stored?
    uint256 private _totalSupply;

    // descriptions
    string private _name;
    string private _symbol;

    //uint8 private _decimals; // wtf is this?

    // only run when the contract is created
    constructor(string memory name, string memory symbol) public {
        _name = name;
        _symbol = symbol;
        _totalSupply = 0;
        minter = msg.sender;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    // minter can create & send as many coins as possible
    function mint(address receiver, uint256 amount) public {
        require(msg.sender == minter, "only minter is allowed to mint");
        require(amount < 1e60, "amount too large");
        _totalSupply = _totalSupply.add(amount);
        _balances[receiver] = _balances[receiver].add(amount);
    }

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    // totalSupply returns total supply of existing coins circulating
    // implements IERC20 interface
    // view ensures that it does not modify the state
    function totalSupply() public override view returns (uint256) {
        return _totalSupply;
    }

    // balanceOf returns supply of coins belonging to given account
    // implements IERC20 interface
    function balanceOf(address account) public override view returns (uint256) {
        return _balances[account];
    }

    // transfer moves given amount of tokens to recipient
    // implements IERC20 interface
    function transfer(address recipient, uint256 amount)
        public
        override
        returns (bool)
    {
        require(amount <= _balances[msg.sender], "insufficient balance");
        _balances[msg.sender] = _balances[msg.sender].sub(amount);
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    // allowance returns the remaining number of tokens that spender will be allowed to spend on behalf of owner through {transferFrom}
    // implements IERC20 interface
    function allowance(address owner, address spender)
        public
        override
        view
        returns (uint256)
    {
        return allowed[owner][spender];
    }

    // approve sets amount delegated to spender to spend
    // implements IERC20 interface
    function approve(address spender, uint256 amount)
        public
        override
        returns (bool)
    {
        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    // transferFrom moves amount of tokens from sender to recipient using allowance mechanism
    // implements IERC20 interface
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        require(amount <= _balances[sender], "insufficient balance");
        require(amount <= allowed[sender][msg.sender], "not allowed");
        _balances[sender] = _balances[sender].sub(amount);
        allowed[sender][msg.sender] = allowed[sender][msg.sender].sub(amount);
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
        return true;
    }
}
