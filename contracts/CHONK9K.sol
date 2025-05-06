pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CHONK9K is ERC20, Ownable {
    uint256 private constant TOTAL_SUPPLY = 9_000_000_000 * 10**18; // 9B tokens
    uint256 public burnFee = 100; // 1%
    uint256 public devFee = 100;  // 1%
    uint256 private constant FEE_DENOMINATOR = 10000;

    event Burn(address indexed from, uint256 amount);
    event DevFee(address indexed from, address indexed dev, uint256 amount);

    constructor() ERC20("Chonk9k Token", "CHONK9K") {
        _mint(msg.sender, TOTAL_SUPPLY);
    }

<<<<<<< HEAD
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
=======
    function setFees(uint256 _burnFee, uint256 _devFee) external onlyOwner {
        require(_burnFee + _devFee <= FEE_DENOMINATOR, "Total fees too high");
        burnFee = _burnFee;
        devFee = _devFee;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal virtual override {
        require(sender != address(0), "Transfer from zero address");
        require(recipient != address(0), "Transfer to zero address");

        // Calculate fees
        uint256 totalFee = (amount * (burnFee + devFee)) / FEE_DENOMINATOR;
        uint256 burnAmount = (amount * burnFee) / FEE_DENOMINATOR;
        uint256 transferAmount = amount - totalFee;

        // Transfer tokens
        super._transfer(sender, address(0), burnAmount); // Burn
        emit Burn(sender, burnAmount);

        super._transfer(sender, owner(), totalFee - burnAmount); // Dev fee
        emit DevFee(sender, owner(), totalFee - burnAmount);

        super._transfer(sender, recipient, transferAmount);
>>>>>>> d264972e5ae2cd17648e746d9eeec5d40b70b9bb
    }
}
