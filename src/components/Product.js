import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Rating from "./Rating";

import close from "../assets/close.svg";

const Product = ({ item, provider, account, dappazon, togglePop,order, setOrder }) => {
  // const [order, setOrder] = useState(null)
  const [hasBought, setHasBought] = useState(false)
  // fetch product details
  const fetchProductDetails= async()=>{
    const events = await dappazon.queryFilter("Buy")
    const orders = events.filter(
      (event) => event.args.buyer === account && event.args.itemId.toString() === item.id.toString()
    )

    if (orders.length === 0) return

    const order = await dappazon.orders(account, orders[0].args.orderId)
    setOrder(order)
  }
  console.log('order', order)
  const buyHandle = async ()=>{
    const signer = await provider.getSigner()

    // Buy item...
    let transaction = await dappazon.connect(signer)
    console.log('transaction', transaction)
    let buyproduct = await transaction.buy(item.id, { value: item.cost })
    await buyproduct.wait()

    setHasBought(true)  
  }
  useEffect(() => {
    fetchProductDetails();
  }, [hasBought])
  
  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt="Product" />
        </div>
        <div className="product__overview">
          <h1>{item.name}</h1>
          <Rating value={item.rating} />
          <hr />
          <p>{item.address}</p>
          <h2>{ethers.utils.formatUnits(item.cost.toString(), "ether")} ETH</h2>
          <hr />
          <h2>Overview</h2>
          <p>
            {/* {ethers.utils.commify(item.description.toString(), "ether")} */}
             {/* {item.description}  */}
             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className="product__order">
          <h1>{ethers.utils.formatUnits(item.cost.toString(), "ether")} ETH</h1>
          <p>
            Free Delivery <br />
            <b>
              {new Date(Date.now() + 345600000).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </b>
          </p>
          {item.stock > 0 ? <p>In Stock.</p> : <p>Out of Stock</p>}
          <button className="product__buy" onClick={buyHandle}>
            buy Now
          </button>
          <p><small>Ship from</small> Ethereum Ecomm Dapp</p>
          <p><small>Sold by</small> Ethereum Ecomm Dapp</p>
          {order && (
            <div className='product__bought'>
              Item Ordered and bought on <br />
              <strong>
                {new Date(Number(order.time.toString() + '000')).toLocaleDateString(
                  undefined,
                  {
                    weekday: 'long',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                  })}
              </strong>
              <br/>
              <strong>
                {Number(order.item).toString()}
              </strong>
            </div>
          )}
          <button onClick={togglePop} className="product__close">
            <img src={close} alt="close"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
