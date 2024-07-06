declare const window : any
import React, { useEffect, useState, ReactNode} from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

interface TransactionContextType {
    connectWallet: () => Promise<void>;
    currentAccount: string;
    formData: {
        addressTo: string;
        amount: string;
        keyword: string;
        message: string;
      };
    sendTransaction :  () => Promise<void>
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  }

export const TransactionContext = React.createContext<TransactionContextType | null>(null);

const { ethereum } = window;


const createEthereumContract = async() => {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
  
    return transactionsContract;
  };

  interface TransactionsProviderProps {
    children: ReactNode;
  }

  export const TransactionsProvider = ({children} : TransactionsProviderProps) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
      };

    const connectWallet = async () => {
        try {
          if (!ethereum) return alert("Please install MetaMask.");
    
          const accounts = await ethereum.request({ method: "eth_requestAccounts", });
    
          setCurrentAccount(accounts[0]);
          window.location.reload();
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };

    const checkIfWalletIsConnect = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({ method: "eth_accounts" });
            console.log(accounts)
            if (accounts.length) {
            setCurrentAccount(accounts[0]);

            } else {
            console.log("No accounts found");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const sendTransaction = async () => {
        try{
            if(!ethereum) return alert("Please install metamask!");
            const { addressTo, amount, keyword, message } = formData;
            const transactionsContract = await createEthereumContract();
            const parsedAmount = ethers.parseEther(amount);
            const hexAmount = Number(parsedAmount).toString(16);
            console.log(currentAccount,' ', addressTo)
            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                  from: currentAccount,
                  to: addressTo,
                  gas: "0x5208",
                  value: hexAmount,
                }],
            });
            const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setIsLoading(false);

            const transactionsCount = await transactionsContract.getTransactionCount();

            setTransactionCount(transactionsCount.toString());
            //window.location.reload();

        }catch(error){
            console.log(error)
        }
    };

    useEffect(() => {
        checkIfWalletIsConnect();
      }, []);


      return (
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, sendTransaction, handleChange}}>
          {children}
        </TransactionContext.Provider>
      );

  };