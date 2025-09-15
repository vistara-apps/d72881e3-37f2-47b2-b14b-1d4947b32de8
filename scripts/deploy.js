const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CreatorShare contracts...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy CreatorToken
  console.log("Deploying CreatorToken...");
  const CreatorToken = await ethers.getContractFactory("CreatorToken");
  const creatorToken = await CreatorToken.deploy(
    "CreatorShare Token",
    "CREATOR",
    deployer.address
  );
  await creatorToken.deployed();
  console.log("CreatorToken deployed to:", creatorToken.address);

  // Deploy RevenueSplitter
  console.log("Deploying RevenueSplitter...");
  const RevenueSplitter = await ethers.getContractFactory("RevenueSplitter");
  const revenueSplitter = await RevenueSplitter.deploy(deployer.address);
  await revenueSplitter.deployed();
  console.log("RevenueSplitter deployed to:", revenueSplitter.address);

  // Deploy EngagementReward
  console.log("Deploying EngagementReward...");
  const EngagementReward = await ethers.getContractFactory("EngagementReward");
  const engagementReward = await EngagementReward.deploy(creatorToken.address);
  await engagementReward.deployed();
  console.log("EngagementReward deployed to:", engagementReward.address);

  // Transfer ownership of CreatorToken to EngagementReward contract
  console.log("Transferring CreatorToken ownership to EngagementReward...");
  await creatorToken.transferOwnership(engagementReward.address);
  console.log("Ownership transferred successfully");

  // Save deployment addresses
  const deploymentInfo = {
    network: network.name,
    creatorToken: creatorToken.address,
    revenueSplitter: revenueSplitter.address,
    engagementReward: engagementReward.address,
    deployer: deployer.address,
    deployedAt: new Date().toISOString()
  };

  console.log("Deployment completed!");
  console.log("Deployment info:", deploymentInfo);

  // Save to file
  const fs = require("fs");
  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

