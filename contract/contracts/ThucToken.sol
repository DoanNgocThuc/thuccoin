// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ThucToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("ThucToken", "THC") {
        _mint(msg.sender, initialSupply);
    }
}
