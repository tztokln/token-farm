async function main() {
    const deployedToken = require(`../artifacts/contracts/TokenFarm.sol/TokenFarm.json`);
    const tokenFarmAddress = deployedToken.contractAddress;
    const TokenFarm = await ethers.getContractFactory('TokenFarm');
    const tokenFarm = await TokenFarm.attach(tokenFarmAddress);
    await tokenFarm.issueTokens()
    console.log("Tokens issued!")
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
