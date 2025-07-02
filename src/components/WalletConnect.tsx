import React, { useState } from 'react';
import { BrowserProvider } from 'ethers'; // Use BrowserProvider from ethers v6
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

interface WalletConnectProps {
  onConnect: (address: string, aaAddress: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask or another Web3 wallet.');
      return;
    }

    setIsLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      // Mock AA address for now (as per original implementation)
      const aaAddress = `0xAA${userAddress.slice(2, 10)}...${userAddress.slice(-8)}`;
      setAddress(userAddress);
      setIsConnected(true);
      onConnect(userAddress, aaAddress);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={connectWallet}
      disabled={isLoading}
      className={`px-6 py-3 rounded-lg font-semibold text-white ${
        isConnected ? 'bg-accent' : 'bg-secondary'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading
        ? 'Connecting...'
        : isConnected
        ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`
        : 'Connect Wallet'}
    </motion.button>
  );
};

export default WalletConnect;