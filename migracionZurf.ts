import { contracts } from './src/utils/consts/contracts';
import fs from 'fs';
import { ethers } from 'ethers';
import axios from 'axios';
import { errors } from './src/utils/consts/errors';
import BigNumber from 'bignumber.js';

type FeePerGas = {
  max: ethers.BigNumber;
  maxPriority: ethers.BigNumber;
};

const provider = new ethers.providers.JsonRpcProvider(
  'https://dimensional-black-shape.matic.quiknode.pro/b1b2f49d4c41d42d2c84e3504b56382184ccb75b/'
);
provider.pollingInterval = 3000; 
const contractABI = contracts.OLD_ZURF_ABI;
const contractAddress = '0x232804231dE32551F13A57Aa3984900428aDf990';
const newContractABI = contracts.NEW_ZURF_ABI;
const newContractAddress = '0x8906365c65589e87870040d681e51a69e9c6f91e';

const wallet_pk = '';
const wallet = new ethers.Wallet(wallet_pk, provider);

const contract = new ethers.Contract(contractAddress, contractABI, wallet);
const newContract = new ethers.Contract(newContractAddress, newContractABI, wallet);

const transferTokens = async (toAddress: string, amount: string) => {
  const valueInWei = ethers.utils.parseEther(amount);
  const feePerGas = await getGasToPay();

  const tx = await newContract.transfer(toAddress, valueInWei, {
    gasPrice: feePerGas.max,
  });

  const receipt = await tx.wait();

  console.log(`Transaction hash: ${receipt.transactionHash}`);
};

async function getGasToPay(): Promise<FeePerGas> {
  try {
    const { data } = await axios({
      method: 'GET',
      url: 'https://gasstation.polygon.technology/v2',
    });

    const feePerGas: FeePerGas = {
      max: ethers.utils.parseUnits(Math.ceil(data.fast.maxFee) + '', 'gwei'),
      maxPriority: ethers.utils.parseUnits(Math.ceil(data.fast.maxPriorityFee) + '', 'gwei'),
    };

    return feePerGas;
  } catch (err) {
    throw new Error(`Error getting gas to pay: ${err}`);
  }
}

const myFunction = async () => {
  let allBalances = [] as { address: string; balance: number }[];

  let seenAddresses = {} as { [address: string]: boolean };

    let csvHolders = new Set();
    if (fs.existsSync('zurfHolders1.csv')) {
      const data = fs.readFileSync('zurfHolders1.csv', 'utf8');
      const rows = data.split('\n');
      csvHolders = new Set();

      for (let i = 1; i < rows.length; i++) {
        let holderAddress = rows[i].split(',')[0];
        holderAddress = holderAddress.replace(/n/g, '');
        holderAddress = holderAddress.replace(/\"/g, '');
        csvHolders.add(holderAddress);
      }
    }

    let allHoldersArray: any[] = Array.from(csvHolders);


    const allHoldersArrayLowercase = allHoldersArray.map((address) => address.toLowerCase());
    let combinedArray = Array.from(
      new Set([...allHoldersArrayLowercase])
    );

    let chunks: any[] = [];
    for (let i = 0; i < combinedArray.length; i += 15) {
      chunks.push(combinedArray.slice(i, i + 15));
    }

    for (let i = 0; i < chunks.length; i++) {
      try {
        await Promise.all(
          chunks[i].map(async (address: string, j: number) => {
            console.log(`Processing index ${i * 15 + j} with address ${address}`);

            if (!address) {
              console.log('Skipping empty address');
              return;
            }

            const balance = await contract.balanceOf(address);
            const decimals = 18
            const formattedBalance = ethers.utils.formatUnits(balance, decimals);
            if (!balance.isZero()) {
              const balanceInfo = {
                address: String(address),
                balance: parseFloat(formattedBalance),
              };
              allBalances.push(balanceInfo);
            }
          })
        );
      } catch (error) {
        throw new Error(`Error getting balances: ${error}`);
      }
    }

    allBalances.sort((a, b) => b.balance - a.balance);


 

  let startAddress = '0x75cC3CA108180Ce2A0003e9be550b412dce73291';
  let startIndex = 0;
  if (startIndex === -1) {
    console.log('Start address not found in remainingWallets');
  } else {
    for (let i = 153; i < allBalances.length; i++) {
      const { address, balance } = allBalances[i];
      
      //let balanceInDecimal = parseFloat(balance.toString()).toFixed(18);
      
      await transferTokens(address, '1');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

myFunction();
