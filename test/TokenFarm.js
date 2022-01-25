const { expect } = require("chai");
const hre = require("hardhat");


describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    // const accounts = await ethers.getSigners();
    const [owner] = await ethers.getSigners();
    const DappToken = await hre.ethers.getContractFactory("DappToken");
    const dappToken = await DappToken.deploy();
    const ownerBalance = await dappToken.balanceOf(owner.address);

        console.log("dappToken", await dappToken.name())
    // for (const account of accounts) {

    //     console.log("ownerBalance", await dappToken.totalSupply())
    //   console.log(account.address,  " ==>" , await dappToken.balanceOf(account.address));
    // }


    expect(await dappToken.totalSupply()).to.equal(ownerBalance);
  });
});