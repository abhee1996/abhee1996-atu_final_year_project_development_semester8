// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract EcommDapp {

    address public owner;
    
    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    //Order
    struct Order {
        uint256 time;
        Item item;
    }

    //MAPPING
    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint256 => Order)) public orders;
    //EVENTS
    event Buy(address buyer, uint256 orderId, uint256 itemId);
    event List(string name, uint256 cost, uint256 quantity);
    //MODIFIERS
    modifier onlyOwner() {
                //only owner have accessed to listing the product

        require(msg.sender == owner);
        _;
    }
    constructor() {
        owner = msg.sender;
    }

    //product list
    function listProduct(uint256 _id,string memory _name,
        string memory _category,string memory _image,
        uint256 _cost,uint256 _rating,uint256 _stock
    ) public onlyOwner {

        //create Item Struct
        Item memory item = Item(_id,_name,_category,
            _image,_cost,_rating,_stock);

        //save Item Struct to the blockchain
        items[_id] = item;
        //Emit an event
        emit List(_name, _cost, _stock);
    }

    //Buy Product
    function buy(uint256 _id) public payable {
        //Fetch Item
        Item memory item = items[_id];
        //Recieve Crypto
        //require enough ether to buy items
        require(msg.value >= item.cost);
        //Require item is in stock
        require(item.stock > 0);
        //Create an order variable with Order struct
        Order memory order = Order(block.timestamp, item);
        //Add order for user
        orderCount[msg.sender]++; // Order ID
        orders[msg.sender][orderCount[msg.sender]] = order;
        //Substract an stock
        items[_id].stock = item.stock - 1;
        //Emit event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }

    //Withdraw funds
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }

    // terminal commands to run hardhat runtime environment
    // npx hardhat node //to run hardhat server
    // npx hardhat run ./scripts/deploy.js --network localhost
    // to run and deploy the deploy.js script

    
    // npx hardhat test //to test the code on hardhat


    //start react app
    //npm start
}
