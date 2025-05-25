async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const initialData = "initial data";
  const initialAdmin = "0xAdminAddressHere";  // Replace with actual admin address
  const initialOwner = "0xOwnerAddressHere";  // Replace with actual owner address

  const ChonkMainnetOwnerEnhanced = await ethers.getContractFactory("ChonkMainnetOwnerEnhanced");
  const contract = await ChonkMainnetOwnerEnhanced.deploy(initialData, initialAdmin, initialOwner);

  await contract.deployed();
  console.log("ChonkMainnetOwnerEnhanced deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

