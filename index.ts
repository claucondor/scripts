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
  'https://maximum-lingering-theorem.bsc.quiknode.pro/726ed6efa4ad6a1cadf6c6409d6d84fc9c73f8dc/'
);
provider.pollingInterval = 5000; // 60 seconds
const contractABI = contracts.KAMALEONT_CONTRACT_ABI;
const contractAddress = contracts.KAMALEONT_CONTRACT_ADDRESSES;
const newContractABI = contracts.KAMALEONT_NEW_ABI;
const newContractAddress = '';

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

    const proposedGasPrice = ethers.utils.parseUnits(data.result.ProposeGasPrice, 'gwei');
    const increasedGasPrice = proposedGasPrice.mul(100).div(100); 

    const feePerGas: FeePerGas = {
      max: increasedGasPrice,
      maxPriority: increasedGasPrice,
    };

    return feePerGas;
  } catch (err: any) {
    throw new Error(`${errors.INTERNAL}: ${err.message}`);
  }
}

const myFunction = async () => {
  let allBalances = [] as { address: string; balance: string }[];

  let seenAddresses = {} as { [address: string]: boolean };

  try {
    const response = await axios.get(
      'https://zurf-web3-agency-api-dot-zurf-web3-agency.uc.r.appspot.com/klt/holders'
    );
    const holders = response.data.holders;

    for (let i = 0; i < holders.length; i++) {
      const holder = holders[i];
      //console.log(`Processing index ${i} with address ${holder.address}`);

      if (!holder.address || seenAddresses[holder.address]) {
        //  console.log('Skipping empty or duplicate address');
        continue;
      }

      seenAddresses[holder.address] = true;

      const balanceInfo = {
        address: String(holder.address),
        balance: String(holder.balance),
      };
      allBalances.push(balanceInfo);
    }
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  }

  let totalBalance = allBalances.reduce((total, balanceInfo) => {
    return new BigNumber(total).plus(new BigNumber(balanceInfo.balance));
  }, new BigNumber(0));

  console.log(`Total balance: ${totalBalance}`);

  let contracts = [
    {
      address: '0x7ca57832836992b504999b2bf8b05721ae7a709e',
      balance: '488716752.6260711',
    },
    {
      address: '0xe933061b02037e29c0ab8da518ea6b2f633195ac',
      balance: '325127871.260398',
    },
    {
      address: '0x174bcb348c6fa54f0e1fb5a57857ef647643f5e2',
      balance: '302664558.53976566',
    },
    {
      address: '0x6e26d6016b3c11565a142b02a5945519be4d8ff5',
      balance: '224346930.95074943',
    },
    {
      address: '0xc4028c32e4a63b3ff21b8ada5d1375c09a5c7b07',
      balance: '210046819.56372565',
    },
    {
      address: '0xee04bf045f97c9bad6a3a587e17a54f08f9a3112',
      balance: '185058045.45827228',
    },
    {
      address: '0x0420b50482bd6939db1a21344c858dc68babf573',
      balance: '179116696.36840788',
    },
    {
      address: '0xf90c8b6c83469aac8f9f62afb3c28254c9248bf6',
      balance: '161155801.31130227',
    },
    {
      address: '0xbc989f0036bf540ddafe98db7be3c1fdb7dd336a',
      balance: '145658959.931619',
    },
    {
      address: '0x46fac2ca8bebd8b36545dccfabf83a224ca242c5',
      balance: '144062236.18163383',
    },
    {
      address: '0x972835082766e89423bca59a07013ae881955b27',
      balance: '140311330.9594465',
    },
    {
      address: '0x0436e2738bd63ecdae0388bd456edf37dc15ceee',
      balance: '135689020.42549062',
    },
    {
      address: '0xe6691a12841a97ebbb8c36c1270b3768e317622f',
      balance: '130835709.92493413',
    },
    {
      address: '0xef56613ff5c82d5379398c5c068f312777fad08c',
      balance: '123790489.78471187',
    },
    {
      address: '0xd4518b4c2c057007fc104bffb5fdfc96ca6e94c1',
      balance: '117174696.91219044',
    },
    {
      address: '0xdfa8a8194c900c4a373f36ddfcf5e238e744dcaa',
      balance: '93339431.24008569',
    },
    {
      address: '0xf23e81ee4e51d40fae1f8f51a1fcd62f9f3c02e0',
      balance: '91962341.87685171',
    },
    {
      address: '0x6bf7e322e23a31edf91c9791363b14c8d5cee83f',
      balance: '89160231.45486149',
    },
    {
      address: '0x697647b5577221048d051ec2ecaa8ac85fccc759',
      balance: '80034810.4512469',
    },
    {
      address: '0xc00b5b7701a7dfb1cdd6a8b93b7b7684d697c46e',
      balance: '69475552.54514997',
    },
    {
      address: '0x172cdad8d114660ffeb7bdb87fe3fc8772c07ff4',
      balance: '65432252.06475749',
    },
    {
      address: '0x9f9da123467c97d5fd6d1a0057577a9f0d0280be',
      balance: '54150369.09241041',
    },
    {
      address: '0x91472c3ab0af49a3e922d258d0bad2cefd068de0',
      balance: '53253329.68936308',
    },
    {
      address: '0x812a7d495f189828a9fc081d145fe3dd2f7cea88',
      balance: '44230043.97126891',
    },
    {
      address: '0x1412ebca936f82d187a54534eb674b2c0e42ee65',
      balance: '19991791.76583279',
    },
    {
      address: '0x71f92436768d4057bdb1c7a997a05e7cb07b923a',
      balance: '13629645.172021465',
    },
    {
      address: '0xf87940f78f2f4d99a0c5c22e3fcc21795cd53245',
      balance: '9640799.345620891',
    },
    {
      address: '0x3677f46b956a1f72b886a3f44f5dd65313dbfb16',
      balance: '32530.08362697',
    },
    {
      address: '0x9aba6b562afce02430c07219debe20b1bc9f336d',
      balance: '1838.030278068',
    },
    {
      address: '0xdd0d6830534022d793734bd0abe9abc90b6a48e8',
      balance: '427.817419444',
    },
    {
      address: '0x0663b3f2085394a2e7c8ec2c41fc96ad8aea94a1',
      balance: '100.33086157',
    },
    {
      address: '0xb96d8bb1a336f5f9c59e639c0d4b3da5d86fad3b',
      balance: '91.496509009',
    },
    {
      address: '0x66db8e8dec5f7ae1d8f91cb64dfb00c740c7b2fa',
      balance: '87.093376483',
    },
    {
      address: '0x1685fb01dc0a17e654d8d155bcaeb8b2e764e78a',
      balance: '83.26182319',
    },
    {
      address: '0x000000000000b6b4c2dc4f3f12159df0163f67e9',
      balance: '0.138868666',
    },
    {
      address: '0x0656fd85364d03b103ceeda192fb2d3906a6ac15',
      balance: '0.037886572',
    },
    {
      address: '0xe37e799d5077682fa0a244d46e5649f71457bd09',
      balance: '0.010893555',
    },
    {
      address: '0x8ec472cb2b9daab42d94b7a9319807752a96b78d',
      balance: '0.000002251',
    },
    {
      address: '0x48d30aa96019d881eaa0b96556c99463d38b8ec3',
      balance: '0.000002236',
    },
    {
      address: '0xf081470f5c6fbccf48cc4e5b82dd926409dcdd67',
      balance: '1e-9',
    },
    {
      address: '0x1111111254eeb25477b68fb85ed929f73a960582',
      balance: '1e-9',
    },
    {
      address: '0x00000000002c6af25c23d8581499b8bccaf453ec',
      balance: '1e-9',
    },
    {
      address: '0x886d4cff37156ec68a26938698071e159b3d2d1a',
      balance: '1e-9',
    },
    {
      address: '0x0000000000f92b9350f41fa6cd93be16ff7649db',
      balance: '1e-9',
    },
    {
      address: '0x0000000000dba7f30ba877d1d66e5324858b1278',
      balance: '1e-9',
    },
    {
      address: '0x6778bfa3904ae3386236ef397620816c90cd351f',
      balance: '1e-9',
    },
  ] as { address: string; balance: string }[];

  let contractsBalances = allBalances.filter(balanceInfo => 
    contracts.some(contract => contract.address === balanceInfo.address)
  );
  
  let wallets = allBalances.filter(balanceInfo => 
    !contracts.some(contract => contract.address === balanceInfo.address)
  );

  wallets.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
  contractsBalances.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
  wallets.forEach((wallet) => (wallet.address = wallet.address.toLowerCase()));
  contractsBalances.forEach((contract) => (contract.address = contract.address.toLowerCase()));

  const liquidityContracts: { [key: string]: string } = {
    '0xE6691a12841a97EBbB8c36C1270B3768e317622f': 'PancakeSwap V2: KLT 14',
    '0x71F92436768D4057BDB1c7a997a05E7cb07b923a': 'PancakeSwap V2: BSC-USD-KLT',
    '0x9abA6b562afcE02430C07219DEBe20B1BC9f336d': 'PancakeSwap V2: wPROSUS-KLT',
    '0xdD0d6830534022d793734BD0AbE9abC90b6A48E8': 'PancakeSwap V2: bPROSUS-KLT',
  };

  const coinstoreExchange: { [key: string]: string } = {
    '0x20664cacdcfeb318C8e145a03C75e34bc2CC4A3b': 'Coinstore Exchange',
  };

  for (let key in liquidityContracts) {
    if (key !== key.toLowerCase()) {
      liquidityContracts[key.toLowerCase()] = liquidityContracts[key];
      delete liquidityContracts[key];
    }
  }

  for (let key in coinstoreExchange) {
    if (key !== key.toLowerCase()) {
      coinstoreExchange[key.toLowerCase()] = coinstoreExchange[key];
      delete coinstoreExchange[key];
    }
  }
  interface Contract {
    address: string;
    balance: string;
  }
  let liquidityContractsList: Contract[] = [];
  let coinstoreExchangeList: Contract[] = [];
  let untaggedContracts: Contract[] = [];
  let burnTokensList: Contract[] = [];

  for (let i = 0; i < contractsBalances.length; i++) {
    const contract = contractsBalances[i];
    const address = contract.address.toLowerCase();

    if (address in liquidityContracts) {
      liquidityContractsList.push(contract);
    } else {
      untaggedContracts.push(contract);
    }
  }

  let remainingWallets:  Contract[] = [];

  for (let i = 0; i < wallets.length; i++) {
    const wallet = wallets[i];
    const address = wallet.address.toLowerCase();
  
    if (address === '0x000000000000000000000000000000000000dead') {
      burnTokensList.push(wallet);
    } else if (address in coinstoreExchange) {
      coinstoreExchangeList.push(wallet);
    } else {
      remainingWallets.push(wallet);
    }
  }
  console.log(`Total wallets: ${remainingWallets.length}`);
  console.log(
    `Total wallet balance: ${remainingWallets.reduce(
      (total, wallet) => total + parseFloat(wallet.balance),
      0
    )}`
  );

  console.log(`Total liquidity contracts: ${liquidityContractsList.length}`);
  Object.keys(liquidityContracts).forEach((key) => {
    const contractBalance = liquidityContractsList
      .filter((contract) => contract.address.toLowerCase() === key)
      .reduce((total, contract) => total + parseFloat(contract.balance), 0);
    console.log(`${liquidityContracts[key]} balance: ${contractBalance}`);
  });

  console.log(`Total coinstore contracts: ${coinstoreExchangeList.length}`);
  Object.keys(coinstoreExchange).forEach((key) => {
    const contractBalance = coinstoreExchangeList
      .filter((contract) => contract.address.toLowerCase() === key)
      .reduce((total, contract) => total + parseFloat(contract.balance), 0);
    console.log(`${coinstoreExchange[key]} balance: ${contractBalance}`);
  });

  console.log(`Total untagged contracts: ${untaggedContracts.length}`);
  console.log(
    `Total untagged contract balance: ${untaggedContracts.reduce(
      (total, contract) => total + parseFloat(contract.balance),
      0
    )}`
  );

  console.log(`Total burn tokens: ${burnTokensList.length}`);
  console.log(
    `Total burn token balance: ${burnTokensList.reduce(
      (total, wallet) => total + parseFloat(wallet.balance),
      0
    )}`
  );
  const totalAddresses =
  remainingWallets.length +
  liquidityContractsList.length +
  coinstoreExchangeList.length +
  untaggedContracts.length +
  burnTokensList.length; 

const totalBalances =
  remainingWallets.reduce((total, wallet) => total + parseFloat(wallet.balance), 0) +
  liquidityContractsList.reduce((total, contract) => total + parseFloat(contract.balance), 0) +
  coinstoreExchangeList.reduce((total, contract) => total + parseFloat(contract.balance), 0) +
  untaggedContracts.reduce((total, contract) => total + parseFloat(contract.balance), 0) +
  burnTokensList.reduce((total, wallet) => total + parseFloat(wallet.balance), 0); 


  untaggedContracts.forEach(contract => {
    console.log(contract.address, contract.balance);
  });

  console.log(`Total addresses to transfer: ${totalAddresses}`);
  console.log(`Total balance to transfer: ${totalBalances}`);

  console.log(`Total liquidity contracts: ${liquidityContractsList.length}`);
  console.log(`Liquidity contracts will be transferred to their own addresses`);

  console.log(`Total burn tokens: ${burnTokensList.length}`);
  console.log(`Burn tokens will be transferred to: 0xa06d102DBD8d6e45B588661015487000e4d37C7b`);

  console.log(`Total untagged contracts: ${untaggedContracts.length}`);
  console.log(
    `Untagged contracts will be transferred to: 0x9a2f7CCf5a6DB4E3A7A707A2c98a6ad19AE538dD`
  );

  console.log(`Total coinstore contracts: ${coinstoreExchangeList.length}`);
  console.log(
    `Coinstore contracts will be transferred to: 0x88A25DE5c2dCA9400dc3f886112D24b302d62fd9`
  );

  console.log(`Total wallets: ${remainingWallets.length}`);
  console.log(`Wallets will be transferred to their own addresses`);



  // Transfer burn tokens
  for (let i = 0; i < burnTokensList.length; i++) {
    const { balance } = burnTokensList[i];
    await transferTokens('0xa06d102DBD8d6e45B588661015487000e4d37C7b', balance);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  // Transfer untagged contracts
  let totalBalanceUntagged = untaggedContracts.reduce((sum, contract) => sum + Number(contract.balance), 0);
  await transferTokens('0x9a2f7CCf5a6DB4E3A7A707A2c98a6ad19AE538dD', totalBalanceUntagged.toString());
  
  let totalBalanceCoinstore = coinstoreExchangeList.reduce((sum, contract) => sum + Number(contract.balance), 0);
  await transferTokens('0x88A25DE5c2dCA9400dc3f886112D24b302d62fd9', totalBalanceCoinstore.toString());
  
  let totalBalanceLiquidity = liquidityContractsList.reduce((sum, contract) => sum + Number(contract.balance), 0);
  await transferTokens('0x1Ad26dAD5db137ED50cBac31323E0E5208260c02', totalBalanceLiquidity.toString());

  let startAddress = '0xd5A191431459AF576bD3C09F6a430DAb2eD0afbF';
  //let startIndex = remainingWallets.findIndex(wallet => wallet.address === startAddress.toLowerCase());
  let startIndex = 0;
  if (startIndex === -1) {
    console.log('Start address not found in remainingWallets');
  } else {
    for (let i = 0; i < remainingWallets.length; i++) {
      const { address, balance } = remainingWallets[i];
      
      let balanceInDecimal = parseFloat(balance).toFixed(9);
      
      await transferTokens(address, balanceInDecimal);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

myFunction();
