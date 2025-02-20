import { ethers } from "hardhat";
import fs from "fs";

async function main() {
    const filePath = "cleaneddata.txt"; // Path to your text file
    const receiver = "0x09E28484d47234e893f86735bf9d63eB09d8F293"; // Replace with recipient's address

    // Step 1: Read and clean the file content
    let rawData;
    try {
        rawData = fs.readFileSync(filePath, "utf-8").trim();
    } catch (error) {
        console.error("Error reading file:", error);
        return;
    }

    // Step 2: Clean the format and parse the array
    function cleanArrayString(rawData: string): string[] | null {
        try {
            const formattedData = rawData.replace(/^"|"$/g, "").replace(/'/g, '"'); // Fix JSON format
            const parsedArray = JSON.parse(formattedData); // Parse into a valid array
            if (!Array.isArray(parsedArray)) throw new Error("Invalid format");
            return parsedArray;
        } catch (error) {
            console.error("Error formatting array:", error);
            return null;
        }
    }

    const cleanedArray = cleanArrayString(rawData);
    if (!cleanedArray) return;

    // Step 3: Extract ETH amount (3rd index, zero-based index 2)
    const ethAmountStr = cleanedArray[2];
    
    if (!ethAmountStr || isNaN(parseFloat(ethAmountStr))) {
        console.error("Invalid ETH amount in file.");
        return;
    }

    const ethAmount = ethers.parseEther(ethAmountStr.toString()); // Convert to ETH format

    // Step 4: Setup sender wallet
    const [sender] = await ethers.getSigners();
    console.log(`Sending ${ethAmountStr} ETH from ${sender.address} to ${receiver}...`);

    // Step 5: Send ETH transaction
    try {
        const tx = await sender.sendTransaction({
            to: receiver,
            value: ethAmount
        });

        await tx.wait();
        console.log(`Transaction successful! Hash: ${tx.hash}`);
    } catch (error) {
        console.error("Transaction failed:", error);
    }
}

main().catch(console.error);
