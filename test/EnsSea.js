const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EnsSea", function () {
  let ensSea;
  const ensSeaName = "EnsSea";
  const ensSeaSymbol = "ESEA";

  beforeEach(async () => {
    const EnsSea = await ethers.getContractFactory("EnsSea");
    ensSea = await EnsSea.deploy(ensSeaName, ensSeaSymbol);
    await ensSea.deployed();
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
  });
});
