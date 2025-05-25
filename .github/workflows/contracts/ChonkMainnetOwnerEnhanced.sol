// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ChonkMainnetOwnerEnhanced {
    address public owner;
    address public admin;
    string private data;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    event DataUpdated(string oldData, string newData);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not admin");
        _;
    }

    constructor(string memory initialData, address initialAdmin, address initialOwner) {
        require(initialOwner != address(0), "Owner cannot be zero address");
        owner = msg.sender; // deployer temporarily owner
        admin = initialAdmin;
        data = initialData;

        emit OwnershipTransferred(address(0), owner);
        emit AdminChanged(address(0), admin);

        // Immediately transfer ownership to initialOwner
        _transferOwnership(initialOwner);
    }

    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0), "New owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        _transferOwnership(newOwner);
    }

    function changeAdmin(address newAdmin) external onlyOwner {
        require(newAdmin != address(0), "New admin is zero address");
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }

    function updateData(string calldata newData) external onlyAdmin {
        string memory oldData = data;
        data = newData;
        emit DataUpdated(oldData, newData);
    }

    function getData() external view returns (string memory) {
        return data;
    }

    function renounceOwnership() external onlyOwner {
        emit OwnershipTransferred(owner, address(0));
        owner = address(0);
    }
}
