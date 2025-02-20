// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EthTransfer {
    address public owner;
    uint256 public constant AMOUNT = 0.001 ether;

    event TransferSuccessful(
        address indexed from,
        address indexed to,
        uint256 amount
    );

    constructor() {
        owner = msg.sender;
    }

    // Function to deposit ETH into the contract
    receive() external payable {}

    // Function to send 0.001 ETH to a specified address
    function sendEth(address payable _receiver) external {
        require(
            address(this).balance >= AMOUNT,
            "Insufficient contract balance"
        );
        require(_receiver != address(0), "Invalid receiver address");

        (bool success, ) = _receiver.call{value: AMOUNT}("");
        require(success, "Transaction failed");

        emit TransferSuccessful(msg.sender, _receiver, AMOUNT);
    }

    // Function to check contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
