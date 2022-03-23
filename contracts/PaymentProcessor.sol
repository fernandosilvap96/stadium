// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PaymentProcessor is Ownable {
    address public admin;
    IERC20 public token;

    event PaymentDone(
        address payer,
        uint256 amount,
        uint256 paymentId,
        uint256 date
    );

    constructor(address adminAddress, address tokenAddress) public {
        admin = adminAddress;
        token = IERC20(tokenAddress);
    }

    function pay(uint256 amount, uint256 paymentId) external {
        token.transferFrom(msg.sender, admin, amount);
        emit PaymentDone(msg.sender, amount, paymentId, block.timestamp);
    }

    //admin
    function setAdmin(address _newAdmin) public onlyOwner {
        admin = _newAdmin;
    }
}
