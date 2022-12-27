// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EnsSea is ERC721{
    address public owner;
    uint256 public domainCount;
    uint256 public totalSupply;

    struct Domain{
        string name;
        uint price;
        bool isAvailable;
    }

    mapping (uint256 => Domain) domains;

modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can perform this action");
    _;
}
    constructor(string memory _name, string memory _symbol) ERC721(_name,_symbol){
        owner = msg.sender;
    }

    function list(string memory _name, uint256 _cost) public onlyOwner  {
        domainCount++;
        domains[domainCount]= Domain(_name, _cost, true);
    }

    function getDomain(uint256 _id) public view returns (Domain memory){
        return domains[_id];
    }

    function mint(uint256 _id) public payable{
        require(_id!=0 && _id<=domainCount, "Invalid domain id");
        require(domains[_id].isAvailable, "Domain is not available");
        require(msg.value >= domains[_id].price, "Insufficient funds");
        domains[_id].isAvailable = false;
        totalSupply++;

        _safeMint(msg.sender, _id);
    }
    function getBalance() public view returns (uint256){
        return address(this).balance;
    }

    function withdraw() public onlyOwner {
        // payable(msg.sender).transfer(getBalance());
        (bool success,) = owner.call{value: getBalance()}("");
        require(success, "Transfer failed.");
    }
}