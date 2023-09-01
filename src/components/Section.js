import { ethers } from "ethers";
import Rating from "./Rating";
const Section = ({ title, items, togglePop }) => {
  return (
    <div className="cards__section">
      <h3 id={title}>{title}</h3>
      <hr />
      <div className="cards">
        {items.map((itm, index) => {
          return (
            <div className="card" key={index} onClick={() => togglePop(itm)}>
              <div className="card__image">
                <img src={itm.image} alt="item" />
              </div>
              <div className="card__info">
                <h4> {itm.name}</h4>
                <Rating value={itm.rating} />
                <p>
                  {ethers.utils.formatUnits(itm.cost.toString(), "ether")} ETH
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Section;
