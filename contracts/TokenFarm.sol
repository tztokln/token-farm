pragma solidity ^0.7.3;

import "./DappToken.sol";
import "./DaiToken.sol";
import "hardhat/console.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public isStaking;
    mapping(address => bool) public hasStaked;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    function stakeTokens(uint256 _amount) public {
        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");

        // console.log("stakeTokens from =>", msg.sender);
        // console.log("stakeTokens to =>",  address(this) );
        
        // transfer tokens to this contract (from/to/amount)
        daiToken.transferFrom(msg.sender, address(this), _amount);
        // Update the staking balance:
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add users to stakers array if they haven't staked already

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // update staking status

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    //unstake tokens

    // Issuing tokens
}
