const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}
const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Clothing";
const IMAGE =
  "https://ipfs.io/ipfs/QmWi9wwiaAvYDZKazStuwZw6pyVf6JSJsqZR7kgbXxWsHE?filename=letter%20from%20university%202.jpeg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;

describe("EcommDapp", () => {   
  let dapp;
  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners();
    console.log('deployer, buyer', deployer.address, buyer.address)
    //Deploy contract
    const EcommDapp = await ethers.getContractFactory("EcommDapp")
    dapp = await EcommDapp.deploy();
  });

  // describe Deployment
  describe("Deployment", () => {
     it("Set the owner", async () => {
       expect(await dapp.owner()).to.equal(deployer.address);
     });
   
  });

    // describe Listing
  describe("Listing", () => {
    let transaction;
    beforeEach(async () => {
      transaction = await dapp
        .connect(deployer)
        .listProduct(ID, NAME, CATEGORY, IMAGE, 
          // DESCRIPTION,
           COST, RATING, STOCK);
      await transaction.wait();
    });
    
    it("Returns item attributes", async () => {
      const item = await dapp.items(ID);
      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
    //  expect(item.description).to.equal(DESCRIPTION);//new 
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    });

    it("Emit List event", () => {
      expect(transaction).to.emit(dapp, "List");
    });
  });


  //BUY test
  describe("Buying", () => {
    let transaction;

    beforeEach(async () => {
      transaction = await dapp
        .connect(deployer)
        .listProduct(ID, NAME, CATEGORY, IMAGE,
          // DESCRIPTION,
           COST, RATING, STOCK);
      await transaction.wait();
      //Buy an item
      transaction = await dapp.connect(buyer).buy(ID, { value: COST });
    });
    it("Update Buyer's order count event", async () => {
      const resultOrder = await dapp.orderCount(buyer.address);

      //ethers.provider.getBalance(dapp.address)
      expect(resultOrder).to.equal(1);
    });
    it("Add the Order event", async () => {
      const order = await dapp.orders(buyer.address, 1);

      //ethers.provider.getBalance(dapp.address)
      expect(order.time).to.be.greaterThan(0); //equal(1);
      expect(order.item.name).to.equal(NAME);
    });

    it("Update the contract balance event", async () => {
      const result = await ethers.provider.getBalance(dapp.address);
      expect(result).to.equal(COST);
    });

    it("Emit Buy Event", () => {
      expect(transaction).to.emit(dapp, "Buy");
    });
  });

  describe("Withdrawing", () => {
    let balanceBefore;
    beforeEach(async () => {
      //List an item
      transaction = await dapp
        .connect(deployer)
        .listProduct(ID, NAME, CATEGORY, IMAGE,
           COST, RATING, STOCK);
      await transaction.wait();
      //Buy an item
      transaction = await dapp.connect(buyer).buy(ID, { value: COST });
      await transaction.wait();
      balanceBefore = await ethers.provider.getBalance(deployer.address);
      transaction = await dapp.connect(deployer).withdraw(); //Withdraw
      await transaction.wait();
    });
    it("Update the owner balance event", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });
    it("Update the contract balance event", async () => {
      const result = await ethers.provider.getBalance(dapp.address);
      expect(result).to.equal(0);
    });
    it("Emit Buy Event", () => {
      expect(transaction).to.emit(dapp, "Buy");
    });
  });

  
})
