// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ThucToken.sol";

contract ThucTokenExchange {
    ThucToken public token;
    address public owner;
    uint256 public rate = 100; // 1 ETH = 100 THC

    constructor(address _tokenAddress) {
        token = ThucToken(_tokenAddress);
        owner = msg.sender;
    }

    // Buy ThucToken with ETH
    function buyTokens() public payable {
        uint256 tokenAmount = msg.value * rate;
        require(token.balanceOf(owner) >= tokenAmount, "Insufficient tokens in reserve");
        token.transferFrom(owner, msg.sender, tokenAmount);
    }

    // Sell ThucToken for ETH
    function sellTokens(uint256 tokenAmount) public {
        uint256 ethAmount = tokenAmount / rate;
        require(address(this).balance >= ethAmount, "Exchange has insufficient ETH");

        token.transferFrom(msg.sender, owner, tokenAmount);
        payable(msg.sender).transfer(ethAmount);
    }

    // Allow contract to receive ETH
    receive() external payable {}
}
