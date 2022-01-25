const { expect, assert } = require("chai");
Web3 = require('web3')
const hre = require("hardhat");

// function tokens(n) {
//     return Web3.utils.toWei(n, 'ether');
// }

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
        await  daiToken.transfer(addr1.address, '100000000000000000000')

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

});
