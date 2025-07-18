// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProofOfStake {
    struct Validator {
        address validator;
        uint256 stake;
    }

    mapping(address => uint256) public stakes;
    address[] public validators;

    event Staked(address indexed user, uint256 amount);
    event ValidatorSelected(address indexed validator);

    function stake() external payable {
        require(msg.value > 0, "Must stake more than 0");

        if (stakes[msg.sender] == 0) {
            validators.push(msg.sender);
        }

        stakes[msg.sender] += msg.value;
        emit Staked(msg.sender, msg.value);
    }

    function getTotalStake() public view returns (uint256 total) {
        for (uint i = 0; i < validators.length; i++) {
            total += stakes[validators[i]];
        }
    }

    function selectValidator() external returns (address) {
        uint total = getTotalStake();
        require(total > 0, "No stakes yet");

        uint random = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, block.number))) % total;

        uint cumulative = 0;
        for (uint i = 0; i < validators.length; i++) {
            cumulative += stakes[validators[i]];
            if (random < cumulative) {
                emit ValidatorSelected(validators[i]);
                return validators[i];
            }
        }

        return address(0);
    }

    function getValidators() external view returns (address[] memory) {
        return validators;
    }
}
