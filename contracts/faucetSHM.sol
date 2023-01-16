// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

error cooldown();
error faucetNotFunded();

contract faucetSHM {

    mapping(address => uint) public userPreviousWithdrawTime;

    receive() external payable {}

    function useFaucet() public {
        if(block.timestamp < userPreviousWithdrawTime[msg.sender] + 43200) {revert cooldown();} 
        if(address(this).balance < 10 ether) {revert faucetNotFunded();}
        userPreviousWithdrawTime[msg.sender] = block.timestamp; //Current faucet user address records current UNIX time for cooldown check. 
        payable(msg.sender).transfer(10 ether);             //Send 20 LINK to current faucet user address.
    }
}