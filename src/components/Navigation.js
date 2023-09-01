import { ethers } from "ethers";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Navigation = ({ account, setAccount, order }) => {
  const [orderList, setorderList] = useState([])
  const connectHandle = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    let account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
    console.log("loading...");
  };
  console.log("order", order);
  return (
    <nav>
      <div className="nav__brand">
        <h1> Ecomm Dapp</h1>
      </div>
      <input type="text" className="nav__search" />
      {account ? (
        <>
          <button type="button" className="nav__connect">
            {account.slice(0, 6) + "..." + account.slice(38, 42)}
          </button>
           <div className="nav__order">Your order :{order !== null? order.item[1] :"no orders"}</div> 
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={connectHandle()}
            className="nav__connect"
          >
            Connect
          </button>
        </>
      )}
    </nav>
  );
};
export default Navigation;
