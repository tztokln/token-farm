const { expect, assert } = require("chai");
const hre = require("hardhat");

require('chai')
    .use(require('chai-as-promised'))
    .should()

describe("Token contract", function () {

    let DappToken, dappToken, DaiToken, daiToken, owner, addr1, addr2, addrs;

    beforeEach(async function () {
        DappToken = await hre.ethers.getContractFactory("DappToken");
        dappToken = await DappToken.deploy();
        DaiToken = await hre.ethers.getContractFactory("DaiToken");
        daiToken = await DaiToken.deploy();

        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        // console.log("HERE", owner, addr1, addr2)

    });

    it('daiToken has a name', async () => {
        const name = await daiToken.name()
        assert.equal(name, 'Mock DAI Token')
    })
    it('dappToken has a name', async () => {
        const name = await dappToken.name()
        assert.equal(name, 'DApp Token')
    })

    it("Deployment should assign the total supply of tokens to the owner", async function () {
        const ownerBalance = await dappToken.balanceOf(owner.address);
        // for (const account of accounts) {
        //   console.log(account.address,  " ==>" , await dappToken.balanceOf(account.address));
        // }
        expect(await dappToken.totalSupply()).to.equal(ownerBalance);
    });

});
