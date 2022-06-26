type Network = 1 | 42 | 10 | 42161;

const BLOCK_EXPLORER_URL = {
  1: 'https://etherscan.io/',
  42: 'https://kovan.etherscan.io/',
  10: 'https://optimistic.etherscan.io/',
  42161: 'https://arbiscan.io/',
};

export const getEtherscanLink = (hash:string, type = 'address', network:Network = 1) => `${BLOCK_EXPLORER_URL[network]}/${type}/${hash}`
