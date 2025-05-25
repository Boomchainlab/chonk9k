async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with deployer:", deployer.address);

  const initialData = "Welcome to $CHONK9K BSC Mainnet Ecosystem";
  const initialAdmin = deployer.address; // or replace with desired admin address
  const finalOwner = "0x0491a04785827d329aF79797d520F08124326D59";

  const OwnerContract = await ethers.getContractFactory("ChonkMainnetOwnerEnhanced");
  const ownerContract = await OwnerContract.deploy(initialData, initialAdmin, finalOwner);

  await ownerContract.deployed();

  console.log("ChonkMainnetOwnerEnhanced deployed at:", ownerContract.address);
  console.log("Ownership transferred immediately to:", finalOwner);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
