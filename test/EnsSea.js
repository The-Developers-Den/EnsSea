const { expect } = require("chai");
const { ethers } = require("hardhat");

const token = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("EnsSea", function () {
  let ensSea;
  let deployer;
  let addr1;
  const ensSeaName = "EnsSea";
  const ensSeaSymbol = "ESEA";

  beforeEach(async () => {
    // Get the ContractFactory and Signers here.
    [deployer, addr1] = await ethers.getSigners();
    // Deploy the contract
    const EnsSea = await ethers.getContractFactory("EnsSea");
    ensSea = await EnsSea.deploy(ensSeaName, ensSeaSymbol);
    await ensSea.deployed();

    const transaction = await ensSea
      .connect(deployer)
      .list("pratham.eth", token(50));
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("it has a name", async () => {
      const ensSeaName = await ensSea.name();
      expect(ensSeaName).to.equal(ensSeaName);
    });
    it("it has a symbol", async () => {
      const ensSeaSymbol = await ensSea.symbol();
      expect(ensSeaSymbol).to.equal(ensSeaSymbol);
    });
    it("it sets owner", async () => {
      const result = await ensSea.owner();
      expect(result).to.equal(deployer.address);
    });
    it("it has total supply", async () => {
      const result = await ensSea.totalSupply();
      expect(result).to.equal(0);
    });
    it("it has domain count", async () => {
      const result = await ensSea.domainCount();
      expect(result).to.equal(1);
    });
  });

  describe("Domain", () => {
    it("returns domain attribute", async () => {
      const domain = await ensSea.getDomain(1);
      expect(domain.name).to.be.equal("pratham.eth");
      expect(domain.price).to.be.equal(token(50));
      expect(domain.isAvailable).to.be.equal(true);
    });
  });

  describe("Minting", () => {
    const domainId = 1;
    const AMOUNT = token(50);

    beforeEach(async () => {
      const transaction = await ensSea
        .connect(addr1)
        .mint(domainId, { value: AMOUNT });
      await transaction.wait();
    });

    it("Updates the owner", async () => {
      const owner = await ensSea.ownerOf(domainId);
      expect(owner).to.be.equal(addr1.address);
    });

    it("Updates the contract balance", async () => {
      const balance = await ensSea.getBalance();
      expect(balance).to.be.equal(AMOUNT);
    });

    it("Updates the domain status", async () => {
      const domain = await ensSea.getDomain(domainId);
      expect(domain.isAvailable).to.be.equal(false);
    });

    it("Updates the total supply", async () => {
      const result = await ensSea.totalSupply();
      expect(result).to.be.equal(1);
    });
  });

  describe("Transfer", () => {
    const domainId = 1;
    const Amount = token(50);
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await ensSea
        .connect(addr1)
        .mint(domainId, { value: Amount });
      await transaction.wait();

      transaction = await ensSea.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("Updateds owner balance", async () => {
      const result = await ethers.provider.getBalance(deployer.address);
      expect(result).to.be.greaterThan(balanceBefore);
    });

    it("Updates conyract balance", async () => {
      const result = await ensSea.getBalance();
      expect(result).to.be.equal(0);
    });
  });
});
