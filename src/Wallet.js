import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "./Wallet.module.css";
import dragon_token from "./abi/dragon_token.json";
import Interactions from "./Interactions";

const Wallet = () => {
  let contractAddress = "0x3ACd76C97B1Ed111c7aB895F39Bd98057F4d2A7E";

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const [tokenName, setTokenName] = useState("Token");
  const [tokenSymbol, setTokenSymbol] = useState(null);
  const [transferHash, setTransferHash] = useState(null);

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(
      contractAddress,
      dragon_token,
      tempSigner
    );
    setContract(tempContract);
  };

  useEffect(() => {
    if (contract != null) {
      updateTokenName();
      updateTokenSymbol();
    }
  }, [contract]);

  const updateTokenName = async () => {
    setTokenName(await contract.name());
  };
  const updateTokenSymbol = async () => {
    setTokenSymbol(await contract.symbol());
  };

  return (
    <div>
      <h2> {tokenName + " ERC-20 Wallet"} </h2>
      <button className={styles.button6} onClick={connectWalletHandler}>
        {connButtonText}
      </button>

      <div className={styles.walletCard}>
        <div>
          <h3>Address: {defaultAccount}</h3>
        </div>
        <div>
          <h3>Token Name: {tokenName}</h3>
        </div>
        <div>
          <h3>Symbol: {tokenSymbol} </h3>
        </div>

        {errorMessage}
      </div>
      <Interactions contract={contract} />
    </div>
  );
};

export default Wallet;
