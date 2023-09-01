const hre = require("hardhat");
const { create } = require("ipfs-http-client");

//new code
const INFURA_ID = "2N16yu7TumvKT7mNWPeAWnU0fuS";
const INFURA_SECRET_KEY = "d163ef154835de000684c1e27f059e64";
const auth =
  "Basic " +
  Buffer.from(INFURA_ID + ":" + INFURA_SECRET_KEY).toString("base64");
async function ipfsClient() {
  const ipfs = await create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth, // infura auth credentails
    },
  });
  return ipfs;
}

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};
const tokenDisc = (n) => {
  // return ethers.utils.parseUnits(n)//parseUnits()
  return ethers.utils.commify(n.toString(), "ether");
};
async function getData(hash) {
  let ipfs = await ipfsClient();
  let asyncitr = ipfs.cat(hash);
  let data;
  for await (const itr of asyncitr) {
    data = Buffer.from(itr).toString();
  }
  return data;
}

async function main() {
  //get deployer from ethers.signers()
  const [deployer] = await ethers.getSigners();
  let item;
  let items;
  // fetch product list data from IPFS
  items = await getData("QmU5ZsDwQ6xBDPBxYMWbhZiitZqNTUbho2Jt49H1VCkivN");
  item = JSON.parse(items);

  // Deploy smart contract
  const Dappazon = await hre.ethers.getContractFactory("EcommDapp");
  const dappazon = await Dappazon.deploy();
  await dappazon.deployed();

  // fetching the product from IPFS and intract with from deployer listproduct()
  for (let i = 0; i < item.length; i++) {
    const transaction = await dappazon.connect(deployer).listProduct(
      item[i].id,
      item[i].name,
      item[i].category,
      item[i].image,
      tokens(item[i].price),
      item[i].rating,
      item[i].stock
    );
    console.log(`dapp ListItem ${item[i].id} : ${item[i].name}`);
    await transaction.wait();
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("error", error);
    // process.exitCode = 1;
    process.exit(1);
  });




















  // console.log(`dappazon contract address 0x610178dA211FEF7D417bC0e6FeD39F05609AD788: ${dappazon.address}`);


    // saved data:https://ipfs.io/ipfs/QmU5ZsDwQ6xBDPBxYMWbhZiitZqNTUbho2Jt49H1VCkivN
  // items = await getData("QmQGB6iHHNjCMgJ6U2rvdY32E6py1C5QyZthp6s9MRpKMw");
  // items = await getData("QmVe36ZeVHyXbRUKWT7HaW8btnMv4xcuVxSdqzDhiRRTj7");
  // items = await getData("QmQViuhdfc5qPrVH6pz8Mc65BairStQwJ4mN2pXqdSY5sV");