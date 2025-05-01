
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CHONK9K is ERC20, Ownable {
    uint256 private constant TOTAL_SUPPLY = 9_000_000_000 * 10**18; // 9B tokens
    uint256 public constant BURN_FEE = 100; // 1%
    uint256 public constant DEV_FEE = 100;  // 1%

    constructor() ERC20("Chonk9k Token", "CHONK9K") Ownable(msg.sender) {
        _mint(msg.sender, TOTAL_SUPPLY);
    }

    function _update(address sender, address recipient, uint256 amount) internal virtual override {
        if (sender != address(0) && recipient != address(0)) {
            // Normal transfer logic
            uint256 burnAmount = (amount * BURN_FEE) / 10000;
            uint256 devAmount = (amount * DEV_FEE) / 10000;
            uint256 transferAmount = amount - burnAmount - devAmount;
            
            // First transfer the fees
            super._update(sender, address(0), burnAmount); // Burn
            super._update(sender, owner(), devAmount);     // Dev fee
            
            // Then do the main transfer with remaining amount
            super._update(sender, recipient, transferAmount);
        } else {
            // For minting and burning operations, proceed normally
            super._update(sender, recipient, amount);
        }
    }
}
