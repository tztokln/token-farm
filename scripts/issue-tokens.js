async function main() {
    const tokenFarmAddress = '0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00';
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
