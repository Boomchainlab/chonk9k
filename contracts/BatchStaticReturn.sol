// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BatchStaticReturn {
    function getBalances(uint256 offset, uint256 step, address factory) external pure returns (uint256[] memory) {
        uint256[] memory balances = new uint256[](step);
        for (uint256 i = 0; i < step; i++) {
            balances[i] = offset + i + 100;  // Simulated balance logic
        }
        return balances;
    }
}
