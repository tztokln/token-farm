const { expect, assert } = require("chai");
Web3 = require('web3')
const hre = require("hardhat");

function tokens(n) {
    return Web3.utils.toWei(n, 'ether');
}

describe("Token contract", function () {
    let DappToken, dappToken, DaiToken, daiToken, TokenFarm, tokenFarm, owner, addr1, addr2, addrs;

    beforeEach(async function () {
        DappToken = await hre.ethers.getContractFactory("DappToken");
        dappToken = await DappToken.deploy();

        DaiToken = await hre.ethers.getContractFactory("DaiToken");
        daiToken = await DaiToken.deploy();

        TokenFarm = await hre.ethers.getContractFactory("TokenFarm");
        tokenFarm = await TokenFarm.deploy(dappToken.address, daiToken.address);
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // Transfer all Dapp tokens to farm (1 million)
        await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

        // // Send tokens to investor
        await daiToken.transfer(addr1.address, '100000000000000000000')

    });


    describe('Mock DAI deployment', async () => {
        it('has a nameee', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('Dapp Token deployment', async () => {
        it('has a name', async () => {
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe('Token Farm deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm')
        })

        it('contract has tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), '1000000000000000000000000')
        })
    })

    describe(" Staking tokens", async () => {
        it('rewards investors for staking tokens', async () => {
            let result
            // check investor balance before staking
            result = await daiToken.balanceOf(addr1.address)
            assert.equal(result.toString(), tokens('100'))

            // stake mock dai tokens
            await daiToken.connect(addr1).approve(tokenFarm.address, tokens('100'))
            await tokenFarm.connect(addr1).stakeTokens(tokens('100'))

            // Check staking result
            result = await daiToken.balanceOf(addr1.address)
            assert.equal(result.toString(), tokens('0'))

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')

            result = await tokenFarm.stakingBalance(addr1.address)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(addr1.address)
            assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

            // Issue tokens
            await tokenFarm.connect(owner).issueTokens()

            // Check balances after issuance
            result = await dappToken.balanceOf(addr1.address)
            assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct affter issuance')

            // Ensure that only onwer can issue tokens
            await expect(tokenFarm.connect(addr1).issueTokens()).to.be.reverted;

            // Unstake tokens
            await tokenFarm.connect(addr1).unstakeTokens()

            // Check results after unstaking
            result = await daiToken.balanceOf(addr1.address)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')
     
            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')

            result = await tokenFarm.stakingBalance(addr1.address)
            assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(addr1.address)
            assert.equal(result.toString(), 'false', 'investor staking status correct after staking')

        })
    })

});
