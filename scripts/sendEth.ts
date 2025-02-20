import { ethers } from "hardhat";

async function main() {
    const receiver = "0x09E28484d47234e893f86735bf9d63eB09d8F293"; // Replace with recipient address
    const [sender] = await ethers.getSigners();

    console.log(`Sending 0.001 ETH from ${sender.address} to ${receiver}...`);

    const tx = await sender.sendTransaction({
        to: receiver,
        value: ethers.parseEther("0.001") // 0.001 ETH
    });

    await tx.wait();

    console.log(`Transaction successful! Hash: ${tx.hash}`);
}

main().catch(console.error);
