
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

    function _transfer(address sender, address recipient, uint256 amount) internal virtual override {
        require(sender != address(0), "Transfer from zero address");
        require(recipient != address(0), "Transfer to zero address");

        uint256 burnAmount = (amount * BURN_FEE) / 10000;
        uint256 devAmount = (amount * DEV_FEE) / 10000;
        uint256 transferAmount = amount - burnAmount - devAmount;

        super._transfer(sender, address(0), burnAmount); // Burn
        super._transfer(sender, owner(), devAmount);     // Dev fee
        super._transfer(sender, recipient, transferAmount);
    }
}
