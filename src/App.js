import { useEffect, useState } from "react";
import { ethers } from "ethers";
// Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// ABIs
import ABIs from "./abis/EcomDapp.json";
// Config
import config from "./config.json";

function App() {
  const [walletAccount, setWalletAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [dappazon, setDappazon] = useState(null);
  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);
  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);
  
  const [order, setOrder] = useState(null)

  const loadBlockChainData = async () => {
    // Connect to blockchain provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();
    //Connect to smart contract(Connect JS versions)
    const dappazon = new ethers.Contract(config[network.chainId].dappazon.address,ABIs,provider);
    setDappazon(dappazon);
    //Load products from Blockchain IPFS
    const items = [];
    for (let i = 0; i < 9; i++) {
      const item = await dappazon.items(i + 1);
      items.push(item);
    }
    const electronics = items.filter((item) => item.category === "electronics");
    setElectronics(electronics);
    const clothing = items.filter((item) => item.category === "clothing");
    setClothing(clothing);
    const toys = items.filter((item) => item.category === "toys");
    setToys(toys);
  };

  const togglePop = (item) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  };
  useEffect(() => {
    loadBlockChainData();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navigation order={order} account={walletAccount} setAccount={setWalletAccount} />
        <h2>Best sellers</h2>
        {electronics && clothing && toys && (
          <>
            <Section
              title={"CLothing & Jewelry"}
              items={clothing}
              togglePop={togglePop}
            />
            <Section
              title={"Electronics & Gadgets"}
              items={electronics}
              togglePop={togglePop}
            />
            <Section
              title={"Toys & Gaming"}
              items={toys}
              togglePop={togglePop}
            />
          </>
        )}

        {toggle && (
          <>
            <Product
              item={item}
              provider={provider}
              account={walletAccount}
              dappazon={dappazon}
              togglePop={togglePop}
              setOrder={setOrder}
            />
          </>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;

