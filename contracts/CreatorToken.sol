// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CreatorToken
 * @dev ERC20 token for creator rewards and engagement
 * Supports minting for engagement rewards and burning for redemption
 */
contract CreatorToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    // Events
    event TokensMinted(address indexed to, uint256 amount, string reason);
    event TokensBurned(address indexed from, uint256 amount, string reason);

    // Engagement reward types
    enum RewardType {
        LIKE,
        COMMENT,
        SHARE,
        REMIX,
        TIP
    }

    // Mapping to track engagement rewards per user per content
    mapping(address => mapping(bytes32 => mapping(RewardType => uint256))) public engagementRewards;
    mapping(address => mapping(bytes32 => bool)) public hasClaimedReward;

    // Platform fee for token operations (in basis points, 100 = 1%)
    uint256 public platformFee = 500; // 5%

    // Maximum supply
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens

    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Mint tokens for engagement rewards
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     * @param contentId Content identifier
     * @param rewardType Type of engagement reward
     */
    function mintEngagementReward(
        address to,
        uint256 amount,
        bytes32 contentId,
        RewardType rewardType
    ) external onlyOwner nonReentrant {
        require(totalSupply() + amount <= MAX_SUPPLY, "CreatorToken: Max supply exceeded");
        require(amount > 0, "CreatorToken: Amount must be positive");

        // Check if user already claimed this reward type for this content
        require(
            !hasClaimedReward[to][contentId] ||
            engagementRewards[to][contentId][rewardType] == 0,
            "CreatorToken: Reward already claimed"
        );

        // Calculate platform fee
        uint256 fee = (amount * platformFee) / 10000;
        uint256 netAmount = amount - fee;

        // Mint tokens
        _mint(to, netAmount);
        _mint(owner(), fee); // Platform fee goes to owner

        // Track reward
        engagementRewards[to][contentId][rewardType] = netAmount;
        hasClaimedReward[to][contentId] = true;

        emit TokensMinted(to, netAmount, "engagement_reward");
    }

    /**
     * @dev Mint tokens for content creation rewards
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mintContentReward(address to, uint256 amount) external onlyOwner nonReentrant {
        require(totalSupply() + amount <= MAX_SUPPLY, "CreatorToken: Max supply exceeded");
        require(amount > 0, "CreatorToken: Amount must be positive");

        _mint(to, amount);
        emit TokensMinted(to, amount, "content_reward");
    }

    /**
     * @dev Burn tokens for redemption
     * @param amount Amount of tokens to burn
     */
    function redeemTokens(uint256 amount) external nonReentrant {
        require(amount > 0, "CreatorToken: Amount must be positive");
        require(balanceOf(msg.sender) >= amount, "CreatorToken: Insufficient balance");

        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount, "redemption");
    }

    /**
     * @dev Set platform fee (only owner)
     * @param newFee New platform fee in basis points
     */
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "CreatorToken: Fee too high"); // Max 10%
        platformFee = newFee;
    }

    /**
     * @dev Get engagement reward amount for a user and content
     * @param user User address
     * @param contentId Content identifier
     * @param rewardType Type of reward
     */
    function getEngagementReward(
        address user,
        bytes32 contentId,
        RewardType rewardType
    ) external view returns (uint256) {
        return engagementRewards[user][contentId][rewardType];
    }

    /**
     * @dev Check if user has claimed reward for content
     * @param user User address
     * @param contentId Content identifier
     */
    function hasUserClaimedReward(address user, bytes32 contentId) external view returns (bool) {
        return hasClaimedReward[user][contentId];
    }
}
