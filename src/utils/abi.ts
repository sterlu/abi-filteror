import Web3EthAbi from 'web3-eth-abi';
import {AbiDefinition, ContractAbi} from "ethereum-types";
import {Network} from './general';

const API_KEY = 'YourApiKeyToken';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export const EXPLORER_APIS = {
    1: 'https://api.etherscan.io',
    10: 'https://api-optimistic.etherscan.io',
    42161: 'https://api.arbiscan.io',
};

export const getAbi = async (address:string, network:Network = 1):Promise<ContractAbi> => {
    console.log(address);
    const apiBase:any = EXPLORER_APIS[network];
    if (!apiBase) throw new Error('Invalid network');
    const url = `${apiBase}/api?module=contract&action=getabi&address=${address}&apikey=${API_KEY}`
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== '1') throw new Error(data.result);
    const abi:ContractAbi = JSON.parse(data.result);
    abi
        .sort((a, b) => {
            if ('name' in a && 'name' in b) return a.name.localeCompare(b.name)
            return 0;
        })
        .sort((a, b) => b.type.localeCompare(a.type));
    const implementation = await getImplementation(abi, address);
    if (implementation && implementation !== NULL_ADDRESS) {
        console.log(`  is proxy, fetching implementation at ${implementation}`);
        await new Promise((res) => setTimeout(res, 5000));
        return getAbi(implementation, network);
    }
    logAbi(abi);
    return abi;
}

const getImplementation = async (abi:ContractAbi, address:string) => {
    try {
        if (abi.filter((abiItem: AbiDefinition) => 'name' in abiItem && abiItem.name === 'implementation')) {
            const EIP1967_IMPLEMENTATION_STORAGE = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
            const res = await window.ethereum.request({
                method: 'eth_getStorageAt',
                params: [address, EIP1967_IMPLEMENTATION_STORAGE, 'latest'],
            })
            const implementation = `0x${res.substr(26)}`;
            return implementation;
        }
    } catch (e) {
        console.error(e);
    }
    return NULL_ADDRESS;
}

const logAbi = (abi:ContractAbi) => {
    const _abi:any[] = [];
    abi.forEach((abiItem:any) => {
        if (abiItem.type === 'function') {
            const id = Web3EthAbi.encodeFunctionSignature(abiItem);
            _abi.push({ ...abiItem, id });
        } else {
            _abi.push(abiItem);
        }
    });
    console.log(_abi);
}
