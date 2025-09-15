// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title RevenueSplitter
 * @dev Contract for splitting revenue among multiple recipients based on predefined percentages
 * Supports both ETH and ERC20 token distributions
 */
contract RevenueSplitter is Ownable, ReentrancyGuard {
    using Address for address payable;

    // Events
    event RevenueSplit(
        bytes32 indexed contentId,
        address indexed payer,
        uint256 totalAmount,
        address token
    );

    event SplitUpdated(bytes32 indexed contentId, address[] recipients, uint256[] percentages);

    // Struct for revenue splits
    struct Split {
        address[] recipients;
        uint256[] percentages; // In basis points (100 = 1%)
        uint256 totalPercentage; // Should equal 10000 (100%)
        bool isActive;
    }

    // Mapping of content ID to revenue split configuration
    mapping(bytes32 => Split) public splits;

    // Platform fee recipient and percentage
    address public platformWallet;
    uint256 public platformFee = 500; // 5% in basis points

    constructor(address _platformWallet) Ownable(msg.sender) {
        require(_platformWallet != address(0), "RevenueSplitter: Invalid platform wallet");
        platformWallet = _platformWallet;
    }

    /**
     * @dev Set revenue split for a content piece
     * @param contentId Unique identifier for the content
     * @param recipients Array of recipient addresses
     * @param percentages Array of percentages in basis points
     */
    function setSplit(
        bytes32 contentId,
        address[] calldata recipients,
        uint256[] calldata percentages
    ) external onlyOwner {
        require(recipients.length == percentages.length, "RevenueSplitter: Arrays length mismatch");
        require(recipients.length > 0, "RevenueSplitter: No recipients");
        require(recipients.length <= 10, "RevenueSplitter: Too many recipients");

        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < percentages.length; i++) {
            require(percentages[i] > 0, "RevenueSplitter: Invalid percentage");
            require(recipients[i] != address(0), "RevenueSplitter: Invalid recipient");
            totalPercentage += percentages[i];
        }

        require(totalPercentage == 10000, "RevenueSplitter: Percentages must sum to 100%");

        splits[contentId] = Split({
            recipients: recipients,
            percentages: percentages,
            totalPercentage: totalPercentage,
            isActive: true
        });

        emit SplitUpdated(contentId, recipients, percentages);
    }

    /**
     * @dev Split ETH revenue according to predefined percentages
     * @param contentId Content identifier
     */
    function splitRevenue(bytes32 contentId) external payable nonReentrant {
        Split storage split = splits[contentId];
        require(split.isActive, "RevenueSplitter: Split not active");
        require(msg.value > 0, "RevenueSplitter: No ETH sent");

        uint256 totalAmount = msg.value;
        uint256 platformAmount = (totalAmount * platformFee) / 10000;
        uint256 remainingAmount = totalAmount - platformAmount;

        // Send platform fee
        payable(platformWallet).sendValue(platformAmount);

        // Distribute to recipients
        for (uint256 i = 0; i < split.recipients.length; i++) {
            uint256 recipientAmount = (remainingAmount * split.percentages[i]) / 10000;
            payable(split.recipients[i]).sendValue(recipientAmount);
        }

        emit RevenueSplit(contentId, msg.sender, totalAmount, address(0));
    }

    /**
     * @dev Split ERC20 token revenue according to predefined percentages
     * @param contentId Content identifier
     * @param token ERC20 token address
     * @param amount Amount of tokens to split
     */
    function splitTokenRevenue(
        bytes32 contentId,
        address token,
        uint256 amount
    ) external nonReentrant {
        require(token != address(0), "RevenueSplitter: Invalid token address");
        require(amount > 0, "RevenueSplitter: Invalid amount");

        Split storage split = splits[contentId];
        require(split.isActive, "RevenueSplitter: Split not active");

        // Transfer tokens from sender to this contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        uint256 platformAmount = (amount * platformFee) / 10000;
        uint256 remainingAmount = amount - platformAmount;

        // Send platform fee
        IERC20(token).transfer(platformWallet, platformAmount);

        // Distribute to recipients
        for (uint256 i = 0; i < split.recipients.length; i++) {
            uint256 recipientAmount = (remainingAmount * split.percentages[i]) / 10000;
            IERC20(token).transfer(split.recipients[i], recipientAmount);
        }

        emit RevenueSplit(contentId, msg.sender, amount, token);
    }

    /**
     * @dev Get split configuration for content
     * @param contentId Content identifier
     */
    function getSplit(bytes32 contentId) external view returns (
        address[] memory recipients,
        uint256[] memory percentages,
        bool isActive
    ) {
        Split storage split = splits[contentId];
        return (split.recipients, split.percentages, split.isActive);
    }

    /**
     * @dev Update platform fee (only owner)
     * @param newFee New platform fee in basis points
     */
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "RevenueSplitter: Fee too high"); // Max 10%
        platformFee = newFee;
    }

    /**
     * @dev Update platform wallet (only owner)
     * @param newWallet New platform wallet address
     */
    function setPlatformWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "RevenueSplitter: Invalid wallet");
        platformWallet = newWallet;
    }

    /**
     * @dev Deactivate a split (only owner)
     * @param contentId Content identifier
     */
    function deactivateSplit(bytes32 contentId) external onlyOwner {
        splits[contentId].isActive = false;
    }

    /**
     * @dev Emergency withdraw function (only owner)
     * @param token Token address (address(0) for ETH)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).sendValue(amount);
        } else {
            IERC20(token).transfer(owner(), amount);
        }
    }

    // Fallback function to receive ETH
    receive() external payable {}
}

// Minimal ERC20 interface
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
