import { contracts } from './src/utils/consts/contracts';
import fs from 'fs';
import { ethers } from 'ethers';
import axios from 'axios';
import { errors } from './src/utils/consts/errors';

type FeePerGas = {
  max: ethers.BigNumber;
  maxPriority: ethers.BigNumber;
};

const provider = new ethers.providers.JsonRpcProvider(
  'https://maximum-lingering-theorem.bsc.quiknode.pro/726ed6efa4ad6a1cadf6c6409d6d84fc9c73f8dc/'
);
provider.pollingInterval = 60000; // 60 seconds
const contractABI = contracts.KAMALEONT_CONTRACT_ABI;
const contractAddress = contracts.KAMALEONT_CONTRACT_ADDRESSES;
const newContractABI = contracts.KAMALEONT_NEW_ABI;
const newContractAddress = '0x50564b31bd79eaa992bc9fdb0b87d345d8039206';

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
    const { data } = await axios.get('https://api.bscscan.com/api', {
      params: {
        module: 'gastracker',
        action: 'gasoracle',
        apikey: 'B15BE5QB7394UEPWKS3FCF9DHTBIIC81WK',
      },
    });

    const feePerGas: FeePerGas = {
      max: ethers.utils.parseUnits(data.result.ProposeGasPrice, 'gwei'),
      maxPriority: ethers.utils.parseUnits(data.result.ProposeGasPrice, 'gwei'),
    };

    return feePerGas;
  } catch (err: any) {
    throw new Error(`${errors.INTERNAL}: ${err.message}`);
  }
}

const myFunction = async () => {
  let allHolders = new Set();

  if (fs.existsSync('holders.csv')) {
    const data = fs.readFileSync('holders.csv', 'utf8');
    const rows = data.split('\n');
    allHolders = new Set();

    for (let i = 1; i < rows.length; i++) {
      let holderAddress = rows[i].split(',')[0];
      holderAddress = holderAddress.replace(/n/g, '');
      holderAddress = holderAddress.replace(/\"/g, ''); // Remove escaped quotes
      allHolders.add(holderAddress);
    }
    //console.log(allHolders);
  }

  let allBalances = [] as { address: string; balance: string }[];

  let allHoldersArray = Array.from(allHolders);

  for (let i = 0; i < allHoldersArray.length; i++) {
    try {
      let address = allHoldersArray[i];
      console.log(`Processing index ${i} with address ${address}`); 
  
      if (!address) {
        console.log('Skipping empty address');
        continue;
      }
  
      const balance = await contract.balanceOf(address);
      const formattedBalance = ethers.utils.formatUnits(balance, 9);
  
      if (!balance.isZero() && parseFloat(formattedBalance) >= 1) {
        const balanceInfo = {
          address: String(address),
          balance: formattedBalance,
        };
        allBalances.push(balanceInfo);
      }
    } catch (error) {
      console.error(`An error occurred with address`);
    }
  }

  let wallets = [] as { address: string; balance: string }[];
  let contracts = [] as { address: string; balance: string }[];
  
  for (let i = 0; i < allBalances.length; i++) {
    const balanceInfo = allBalances[i];
    const code = await provider.getCode(balanceInfo.address);
    if (code === '0x') {
      wallets.push(balanceInfo);
    } else {
      contracts.push(balanceInfo);
    }
  }

  wallets.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
  contracts.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
  wallets.forEach((wallet) => (wallet.address = wallet.address.toLowerCase()));
  contracts.forEach((contract) => (contract.address = contract.address.toLowerCase()));

  //console.log(wallets);
  //console.log(contracts);

  const addressesToRemove: { [key: string]: string } = {
    '0xE6691a12841a97EBbB8c36C1270B3768e317622f': 'PancakeSwap V2: KLT 14',
    '0x20664cacdcfeb318C8e145a03C75e34bc2CC4A3b': 'Coinstore Exchange',
    '0x71F92436768D4057BDB1c7a997a05E7cb07b923a': 'PancakeSwap V2: BSC-USD-KLT',
    '0x9abA6b562afcE02430C07219DEBe20B1BC9f336d': 'PancakeSwap V2: wPROSUS-KLT',
    '0xdD0d6830534022d793734BD0AbE9abC90b6A48E8': 'PancakeSwap V2: bPROSUS-KLT',
  };
  for (let address in addressesToRemove) {
    let value = addressesToRemove[address];
    delete addressesToRemove[address];
    addressesToRemove[address.toLowerCase()] = value;
  }
  const removedContracts = contracts.filter((contract) =>
    addressesToRemove.hasOwnProperty(contract.address)
  );

  console.log('Liquidity contracts:');
  removedContracts.forEach((contract) => {
    console.log(
      `Name: ${addressesToRemove[contract.address]}, Address: ${contract.address}, Balance: ${
        contract.balance
      }`
    );
  });

  contracts = contracts.filter((contract) => !addressesToRemove.hasOwnProperty(contract.address));
  console.log('Other Contracts:');
  contracts.forEach((contract) => {
    console.log(`Address: ${contract.address}, Balance: ${contract.balance}`);
  });

  const testBalance = [
    {
      address: '0x3b2335De0703C91CF718a4CB5F89ba43Ef90E8e2',
      balance: '1',
    },
  ];

  const removedWallet = wallets.find(wallet => wallet.address === '0x000000000000000000000000000000000000dead');

  wallets = wallets.filter(wallet => wallet.address !== '0x000000000000000000000000000000000000dead');

  if (removedWallet) {
    console.log(`Removed wallet: Address: ${removedWallet.address}, Balance: ${removedWallet.balance}`);
  }
  
  for (let i = 0; i < wallets.length; i++) {
    const { address, balance } = wallets[i];
    await transferTokens(address, balance);
    await new Promise(resolve => setTimeout(resolve, 2000));

  }
  
};

myFunction();
