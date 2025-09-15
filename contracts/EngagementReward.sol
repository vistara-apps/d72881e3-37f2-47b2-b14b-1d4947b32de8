// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./CreatorToken.sol";

/**
 * @title EngagementReward
 * @dev Contract for managing engagement-based rewards on content
 * Handles likes, comments, shares, and remixes with token rewards
 */
contract EngagementReward is Ownable, ReentrancyGuard {
    // Reference to the CreatorToken contract
    CreatorToken public creatorToken;

    // Events
    event EngagementRewarded(
        address indexed user,
        bytes32 indexed contentId,
        CreatorToken.RewardType rewardType,
        uint256 amount
    );

    event RewardRateUpdated(CreatorToken.RewardType rewardType, uint256 newRate);

    // Reward rates for different engagement types (in token amount)
    mapping(CreatorToken.RewardType => uint256) public rewardRates;

    // Mapping to track engagement counts per content
    mapping(bytes32 => mapping(CreatorToken.RewardType => uint256)) public engagementCounts;

    // Mapping to track if user has engaged with content
    mapping(address => mapping(bytes32 => mapping(CreatorToken.RewardType => bool))) public hasEngaged;

    // Maximum engagements per user per content per type (to prevent abuse)
    uint256 public constant MAX_ENGAGEMENTS_PER_USER = 1;

    // Cooldown period between engagements (in seconds)
    uint256 public engagementCooldown = 3600; // 1 hour

    // Mapping to track last engagement time
    mapping(address => mapping(bytes32 => uint256)) public lastEngagementTime;

    constructor(address _creatorToken) Ownable(msg.sender) {
        require(_creatorToken != address(0), "EngagementReward: Invalid token address");
        creatorToken = CreatorToken(_creatorToken);

        // Set default reward rates
        rewardRates[CreatorToken.RewardType.LIKE] = 10 * 10**18;      // 10 tokens
        rewardRates[CreatorToken.RewardType.COMMENT] = 25 * 10**18;   // 25 tokens
        rewardRates[CreatorToken.RewardType.SHARE] = 50 * 10**18;     // 50 tokens
        rewardRates[CreatorToken.RewardType.REMIX] = 100 * 10**18;    // 100 tokens
        rewardRates[CreatorToken.RewardType.TIP] = 0;                 // Tips are variable
    }

    /**
     * @dev Reward user for engagement
     * @param user Address of the user to reward
     * @param contentId Content identifier
     * @param rewardType Type of engagement
     */
    function rewardEngagement(
        address user,
        bytes32 contentId,
        CreatorToken.RewardType rewardType
    ) external onlyOwner nonReentrant {
        require(user != address(0), "EngagementReward: Invalid user address");
        require(contentId != bytes32(0), "EngagementReward: Invalid content ID");

        // Check cooldown period
        require(
            block.timestamp >= lastEngagementTime[user][contentId] + engagementCooldown,
            "EngagementReward: Cooldown period not passed"
        );

        // Check if user hasn't already engaged with this type
        require(
            !hasEngaged[user][contentId][rewardType],
            "EngagementReward: User already engaged"
        );

        uint256 rewardAmount = rewardRates[rewardType];
        require(rewardAmount > 0, "EngagementReward: No reward for this type");

        // Mint reward tokens
        creatorToken.mintEngagementReward(user, rewardAmount, contentId, rewardType);

        // Update tracking
        hasEngaged[user][contentId][rewardType] = true;
        engagementCounts[contentId][rewardType]++;
        lastEngagementTime[user][contentId] = block.timestamp;

        emit EngagementRewarded(user, contentId, rewardType, rewardAmount);
    }

    /**
     * @dev Reward tip to content creator
     * @param from Address sending the tip
     * @param to Address receiving the tip
     * @param contentId Content identifier
     * @param amount Amount of tokens to tip
     */
    function rewardTip(
        address from,
        address to,
        bytes32 contentId,
        uint256 amount
    ) external onlyOwner nonReentrant {
        require(from != address(0) && to != address(0), "EngagementReward: Invalid addresses");
        require(contentId != bytes32(0), "EngagementReward: Invalid content ID");
        require(amount > 0, "EngagementReward: Invalid amount");

        // Transfer tokens from sender to receiver
        // Note: This assumes the contract has approval to transfer tokens
        creatorToken.transferFrom(from, to, amount);

        emit EngagementRewarded(to, contentId, CreatorToken.RewardType.TIP, amount);
    }

    /**
     * @dev Update reward rate for engagement type
     * @param rewardType Type of engagement
     * @param newRate New reward rate
     */
    function updateRewardRate(CreatorToken.RewardType rewardType, uint256 newRate) external onlyOwner {
        rewardRates[rewardType] = newRate;
        emit RewardRateUpdated(rewardType, newRate);
    }

    /**
     * @dev Update engagement cooldown period
     * @param newCooldown New cooldown period in seconds
     */
    function updateEngagementCooldown(uint256 newCooldown) external onlyOwner {
        require(newCooldown >= 300, "EngagementReward: Cooldown too short"); // Min 5 minutes
        require(newCooldown <= 86400, "EngagementReward: Cooldown too long"); // Max 24 hours
        engagementCooldown = newCooldown;
    }

    /**
     * @dev Get engagement count for content and type
     * @param contentId Content identifier
     * @param rewardType Type of engagement
     */
    function getEngagementCount(bytes32 contentId, CreatorToken.RewardType rewardType) external view returns (uint256) {
        return engagementCounts[contentId][rewardType];
    }

    /**
     * @dev Check if user has engaged with content
     * @param user User address
     * @param contentId Content identifier
     * @param rewardType Type of engagement
     */
    function hasUserEngaged(
        address user,
        bytes32 contentId,
        CreatorToken.RewardType rewardType
    ) external view returns (bool) {
        return hasEngaged[user][contentId][rewardType];
    }

    /**
     * @dev Get reward rate for engagement type
     * @param rewardType Type of engagement
     */
    function getRewardRate(CreatorToken.RewardType rewardType) external view returns (uint256) {
        return rewardRates[rewardType];
    }

    /**
     * @dev Get total engagement metrics for content
     * @param contentId Content identifier
     */
    function getContentEngagement(bytes32 contentId) external view returns (
        uint256 likes,
        uint256 comments,
        uint256 shares,
        uint256 remixes,
        uint256 totalEngagements
    ) {
        likes = engagementCounts[contentId][CreatorToken.RewardType.LIKE];
        comments = engagementCounts[contentId][CreatorToken.RewardType.COMMENT];
        shares = engagementCounts[contentId][CreatorToken.RewardType.SHARE];
        remixes = engagementCounts[contentId][CreatorToken.RewardType.REMIX];
        totalEngagements = likes + comments + shares + remixes;
    }

    /**
     * @dev Emergency withdraw tokens (only owner)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        creatorToken.transfer(owner(), amount);
    }
}
