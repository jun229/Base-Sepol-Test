import { ethers } from "hardhat";

async function main() {
    const contractAddress = "0x25Ab744ff87175B09c09d7658E3A4E6e42f8043D";
    const receiver = "0x09E28484d47234e893f86735bf9d63eB09d8F293";

    const [sender] = await ethers.getSigners();
    const contract = await ethers.getContractAt("EthTransfer", contractAddress);

    const tx = await contract.sendEth(receiver);
    await tx.wait();

    console.log(`Sent 0.001 ETH from ${sender.address} to ${receiver}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
