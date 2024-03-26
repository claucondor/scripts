import Irys from "@irys/sdk";
import dotenv from "dotenv";
dotenv.config();

const getIrys = async () => {
    const url = "https://node2.irys.xyz";
    const token = "matic";
    const privateKey = process.env.WALLET_PK;

    const irys = new Irys({
        url: url, 
        token: token, 
        key: privateKey,
    });
    return irys;
};

const checkBalance = async (irys: Irys) => {
    const atomicBalance = await irys.getLoadedBalance();
    const convertedBalance = irys.utils.fromAtomic(atomicBalance);
    return convertedBalance;
};

const fundIrys = async (irys: Irys) => {
    try {
        const fundTx = await irys.fund(irys.utils.toAtomic(1));
        console.log(`Successfully funded ${irys.utils.fromAtomic(fundTx.quantity)} ${irys.token}`);
    } catch (e) {
        console.log("Error funding node ", e);
    }
};
// Error funding node  Error: failed to post funding tx - 0x51d5fac087265ab8da1469145ae4d377c728887888fce02038dd2e9a497f2b33 - keep this id!     
const checkAndPrintBalance = async (irys: Irys) => {
    const balance = await checkBalance(irys);
    const threshold = 0.1;

    if (Math.abs(balance.toNumber()) <= threshold) {
        console.log(`Balance ${balance} is within 10% of 0, please fund.`);
        await fundIrys(irys);
        await checkAndPrintBalance(irys);
    } else {
        console.log(`Balance ${balance} funding not yet needed.`);
    }
};
const submitFundTransaction = async (irys: Irys, txId: string) => {
    try {
        const response : any = await irys.funder.submitFundTransaction(txId);
        console.log(`Successfully submitted fund`);
    } catch (err) {
        console.log("Error submitting fund transaction ", err);
    }
};


const uploadData = async (irys: Irys, data: string) => {
    try {
        const receipt = await irys.upload(data);
        console.log(`Data uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
    } catch (e) {
        console.log("Error uploading data ", e);
    }
};

const uploadFile = async (irys: Irys, fileName: string, tags: { name: string, value: string }[]) => {
    try {
        const receipt = await irys.uploadFile(fileName, tags as any);
        console.log(`File uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
    } catch (e) {
        console.log("Error uploading file ", e);
    }
};


const run = async () => {

    const fileToUpload = "./783px-Test-Logo.svg.png";
 
    const tags = [{ name: "Content-Type", value: "image/png" }];
    //const txId = "0x413de45cb451ec9e34b29a735bdf924dcda08f6b7f1ee99187fc80117f84795c";
    const irys = await getIrys();
    //checkAndPrintBalance(irys);
    //await submitFundTransaction(irys, txId);
    //const data = 'test data for irys';
    //await uploadData(irys, data);
    await uploadFile(irys, fileToUpload, tags);
};

run();