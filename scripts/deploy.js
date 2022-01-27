// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");
const fsExtra = require("fs-extra");
// import "hardhat/console.sol";


async function main() {
  // Deploy Mock DAI Token
  const DaiToken = await hre.ethers.getContractFactory("DaiToken");
  const daiToken = await DaiToken.deploy();
  await daiToken.deployed();
  saveTokenAddress(daiToken, 'DaiToken');

  console.log("daiToken deployed to:", daiToken.address);
  // Deploy Dapp Token
  const DappToken = await hre.ethers.getContractFactory("DappToken");
  const dappToken = await DappToken.deploy();
  await dappToken.deployed();
  saveTokenAddress(dappToken, 'DappToken');
  console.log("dappToken deployed to:", dappToken.address);

  // Deploy Token Farm 
  const TokenFarm = await hre.ethers.getContractFactory("TokenFarm");
  const tokenFarm = await TokenFarm.deploy(dappToken.address, daiToken.address);
  await tokenFarm.deployed();
  saveTokenAddress(dappToken, 'TokenFarm');
  console.log("tokenFarm deployed to:", tokenFarm.address);

  const accounts = await ethers.getSigners();

  // Transfer all tokens to TokenFarm (1 million)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

  // Transfer 100 Mock DAI tokens to investor
  await daiToken.transfer(accounts[1].address, '100000000000000000000')

  // copy contracts to src folder
  await fsExtra.copy('artifacts/contracts', 'src/contracts')
    .then(() => console.log('success!'))
    .catch(err => console.error(err))

  function saveTokenAddress(token, name) {
    const deployedToken = require(`../artifacts/contracts/${name}.sol/${name}.json`);

    updatedTokenData = {
      ...deployedToken,
      contractAddress: token.address
    }
    const jsonString = JSON.stringify(updatedTokenData, null, 2)

    fs.writeFile(`artifacts/contracts/${name}.sol/${name}.json`, jsonString, function writeJSON(err) {
      if (err) return console.log(err);
      // console.log(jsonString);
      // console.log('writing to ' + `../artifacts/contracts/${name}.sol/${name}.json`);
    });
  }

}


main()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
