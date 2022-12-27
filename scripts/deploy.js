const hre = require("hardhat");

const token = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
  // Get the ContractFactory and Signers here.
  const [deployer, addr1] = await ethers.getSigners();
  const NAME = "EnsSea";
  const SYMBOL = "ESEA";

  // Deploy the contract
  const EnsSea = await ethers.getContractFactory("EnsSea");
  const ensSea = await EnsSea.deploy(NAME, SYMBOL);
  await ensSea.deployed();

  console.log("EnsSea deployed to:", ensSea.address);

  //List 3 domains
  const names = ["pratham.eth", "can.eth", "code.eth"];
  const prices = [token(10), token(15), token(39)];

  for (var i = 0; i < names.length; i++) {
    const transaction = await ensSea
      .connect(deployer)
      .list(names[i], prices[i]);
    await transaction.wait();

    console.log("Domain listed:", i + 1, names[i]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// addr 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
