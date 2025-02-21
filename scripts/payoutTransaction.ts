import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const filePath = "cleaneddata.txt";
    const winnerAddress = "0x25Ab744ff87175B09c09d7658E3A4E6e42f8043D"; // Replace with actual winner's address
    const privateKey = process.env.PRIVATE_KEY_PAYOUT; // Wallet that holds the funds

    if (!privateKey) {
        console.error("❌ Error: No private key for payout found in .env");
        return;
    }

    // Setup provider & wallet
    const provider = new ethers.JsonRpcProvider("https://sepolia.base.org"); // Base Sepolia RPC
    const wallet = new ethers.Wallet(privateKey, provider);

    // Read and parse ETH amounts from the file
    let totalEth = 0;
    try {
        const rawData = fs.readFileSync(filePath, "utf-8").trim();
        const lines = rawData.split("\n").map(line => line.replace(/'/g, '"').trim());
        for (const line of lines) {
            const transactionData = JSON.parse(line);
            const ethAmountStr = transactionData[2]; // 3rd element is ETH amount
            if (!isNaN(parseFloat(ethAmountStr))) {
                totalEth += parseFloat(ethAmountStr);
            }
        }
    } catch (error) {
        console.error("❌ Error parsing transaction data:", error);
        return;
    }

    // Convert total ETH to BigNumber format
    const amountToSend = ethers.parseEther(totalEth.toString());

    console.log(`💰 Total ETH to send: ${ethers.formatEther(amountToSend)} ETH`);
    console.log(`🚀 Sending ${ethers.formatEther(amountToSend)} ETH to ${winnerAddress}...`);

    // Send transaction
    try {
        const tx = await wallet.sendTransaction({
            to: winnerAddress,
            value: amountToSend
        });

        await tx.wait();
        console.log(`✅ Payout successful! Hash: ${tx.hash}`);
    } catch (error) {
        console.error("❌ Payout transaction failed:", error);
    }
}

main().catch(console.error);
