const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreatorShare Contracts", function () {
  let creatorToken, revenueSplitter, engagementReward;
  let owner, user1, user2, user3;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy CreatorToken
    const CreatorToken = await ethers.getContractFactory("CreatorToken");
    creatorToken = await CreatorToken.deploy("CreatorShare Token", "CREATOR", owner.address);
    await creatorToken.deployed();

    // Deploy RevenueSplitter
    const RevenueSplitter = await ethers.getContractFactory("RevenueSplitter");
    revenueSplitter = await RevenueSplitter.deploy(owner.address);
    await revenueSplitter.deployed();

    // Deploy EngagementReward
    const EngagementReward = await ethers.getContractFactory("EngagementReward");
    engagementReward = await EngagementReward.deploy(creatorToken.address);
    await engagementReward.deployed();

    // Transfer ownership of CreatorToken to EngagementReward
    await creatorToken.transferOwnership(engagementReward.address);
  });

  describe("CreatorToken", function () {
    it("Should mint engagement rewards correctly", async function () {
      const contentId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("content1"));
      const rewardAmount = ethers.utils.parseEther("10");

      await engagementReward.rewardEngagement(user1.address, contentId, 0); // LIKE = 0

      expect(await creatorToken.balanceOf(user1.address)).to.equal(rewardAmount);
    });

    it("Should prevent double claiming rewards", async function () {
      const contentId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("content1"));

      await engagementReward.rewardEngagement(user1.address, contentId, 0); // LIKE = 0

      await expect(
        engagementReward.rewardEngagement(user1.address, contentId, 0)
      ).to.be.revertedWith("EngagementReward: User already engaged");
    });

    it("Should allow token redemption", async function () {
      const contentId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("content1"));
      const rewardAmount = ethers.utils.parseEther("10");

      await engagementReward.rewardEngagement(user1.address, contentId, 0);
      expect(await creatorToken.balanceOf(user1.address)).to.equal(rewardAmount);

      await creatorToken.connect(user1).redeemTokens(rewardAmount);
      expect(await creatorToken.balanceOf(user1.address)).to.equal(0);
    });
  });

  describe("RevenueSplitter", function () {
    it("Should set and execute revenue splits correctly", async function () {
      const contentId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("content1"));
      const recipients = [user1.address, user2.address, user3.address];
      const percentages = [5000, 3000, 2000]; // 50%, 30%, 20%

      // Set split configuration
      await revenueSplitter.setSplit(contentId, recipients, percentages);

      // Get initial balances
      const initialBalances = await Promise.all(
        recipients.map(recipient => ethers.provider.getBalance(recipient))
      );

      // Split revenue
      const totalAmount = ethers.utils.parseEther("1");
      await revenueSplitter.splitRevenue(contentId, { value: totalAmount });

      // Check final balances (accounting for platform fee)
      const platformFee = totalAmount.mul(500).div(10000); // 5%
      const distributableAmount = totalAmount.sub(platformFee);

      for (let i = 0; i < recipients.length; i++) {
        const expectedAmount = distributableAmount.mul(percentages[i]).div(10000);
        const finalBalance = await ethers.provider.getBalance(recipients[i]);
        expect(finalBalance.sub(initialBalances[i])).to.equal(expectedAmount);
      }
    });

    it("Should reject invalid split configurations", async function () {
      const contentId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("content1"));
      const recipients = [user1.address, user2.address];
      const invalidPercentages = [6000, 3000]; // 90% total

      await expect(
        revenueSplitter.setSplit(contentId, recipients, invalidPercentages)
      ).to.be.revertedWith("RevenueSplitter: Percentages must sum to 100%");
    });
  });

  describe("EngagementReward", function () {
    it("Should reward different engagement types", async function () {
      const contentId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("content1"));

      // Reward like
      await engagementReward.rewardEngagement(user1.address, contentId, 0); // LIKE
      expect(await creatorToken.balanceOf(user1.address)).to.equal(ethers.utils.parseEther("10"));

      // Reward comment
      await engagementReward.rewardEngagement(user2.address, contentId, 1); // COMMENT
      expect(await creatorToken.balanceOf(user2.address)).to.equal(ethers.utils.parseEther("25"));
    });

    it("Should enforce cooldown period", async function () {
      const contentId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("content1"));

      await engagementReward.rewardEngagement(user1.address, contentId, 0);

      // Try to engage again immediately (should fail)
      await expect(
        engagementReward.rewardEngagement(user1.address, contentId, 2) // SHARE
      ).to.be.revertedWith("EngagementReward: Cooldown period not passed");
    });

    it("Should update reward rates", async function () {
      const newRate = ethers.utils.parseEther("20");
      await engagementReward.updateRewardRate(0, newRate); // LIKE

      expect(await engagementReward.getRewardRate(0)).to.equal(newRate);
    });
  });
});

