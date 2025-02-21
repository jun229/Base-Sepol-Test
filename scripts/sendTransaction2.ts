import { ethers } from "hardhat";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const filePath = "cleaneddata.txt";
    const receiver = "0x09E28484d47234e893f86735bf9d63eB09d8F293";
    const privateKey = process.env.PRIVATE_KEY_2;

    if (!privateKey) {
        console.error("❌ Error: No private key for transaction 2 found in .env");
        return;
    }

    let rawData;
    try {
        rawData = fs.readFileSync(filePath, "utf-8").trim();
    } catch (error) {
        console.error("❌ Error reading file:", error);
        return;
    }

    const lines = rawData.split("\n").map(line => line.replace(/'/g, '"').trim());

    // Debugging: Ensure we are reading the second line
    console.log(`📄 Extracted ${lines.length} lines from cleaneddata.txt`);
    console.log(`🔹 Second line: ${lines[1]}`);

    if (lines.length < 2) {
        console.error("❌ Error: File does not contain at least two valid transaction arrays.");
        return;
    }

    let transactionData;
    try {
        transactionData = JSON.parse(lines[1]); // Ensure it's reading only the second array
        if (!Array.isArray(transactionData)) throw new Error("Invalid format");
    } catch (error) {
        console.error("❌ Error parsing second transaction data:", error);
        return;
    }

    const ethAmountStr = transactionData[2];

    if (!ethAmountStr || isNaN(parseFloat(ethAmountStr))) {
        console.error("⚠️ Invalid ETH amount:", ethAmountStr);
        return;
    }

    const ethAmount = ethers.parseEther(ethAmountStr.toString());

    const provider = ethers.provider;
    const wallet = new ethers.Wallet(privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`, provider);

    console.log(`🚀 Sending ${ethAmountStr} ETH from ${wallet.address} to ${receiver}...`);

    try {
        const tx = await wallet.sendTransaction({
            to: receiver,
            value: ethAmount
        });

        await tx.wait();
        console.log(`✅ Transaction successful! Hash: ${tx.hash}`);
    } catch (error) {
        console.error("❌ Transaction failed:", error);
    }
}

main().catch(console.error);
