// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract BasePoll {
    struct Poll {
        address creator;
        string question;
        string optionA;
        string optionB;
        uint256 voteA;
        uint256 voteB;
        uint256 startTime;
        uint256 endTime;
        bool exists;
    }

    uint256 public pollCount;

    mapping(uint256 => Poll) public polls;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => uint8)) public userChoice;
    mapping(address => uint256[]) public createdPolls;

    event PollCreated(
        uint256 indexed pollId,
        address indexed creator,
        string question,
        uint256 endTime
    );

    event VoteCast(
        uint256 indexed pollId,
        address indexed voter,
        uint8 choice
    );

    function createPoll(
        string calldata question,
        string calldata optionA,
        string calldata optionB,
        uint256 duration
    ) external {
        require(bytes(question).length > 0, "Question is required");
        require(bytes(optionA).length > 0, "Option A is required");
        require(bytes(optionB).length > 0, "Option B is required");
        require(duration > 0, "Duration must be greater than zero");

        pollCount += 1;

        polls[pollCount] = Poll({
            creator: msg.sender,
            question: question,
            optionA: optionA,
            optionB: optionB,
            voteA: 0,
            voteB: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            exists: true
        });

        createdPolls[msg.sender].push(pollCount);

        emit PollCreated(pollCount, msg.sender, question, block.timestamp + duration);
    }

    function vote(uint256 pollId, uint8 choice) external {
        Poll storage poll = polls[pollId];

        require(poll.exists, "Poll does not exist");
        require(block.timestamp < poll.endTime, "Poll has ended");
        require(choice == 1 || choice == 2, "Invalid vote choice");
        require(!hasVoted[pollId][msg.sender], "Wallet already voted");

        hasVoted[pollId][msg.sender] = true;
        userChoice[pollId][msg.sender] = choice;

        if (choice == 1) {
            poll.voteA += 1;
        } else {
            poll.voteB += 1;
        }

        emit VoteCast(pollId, msg.sender, choice);
    }

    function getPoll(uint256 pollId) external view returns (Poll memory) {
        require(polls[pollId].exists, "Poll does not exist");
        return polls[pollId];
    }

    function getResults(uint256 pollId) external view returns (uint256 voteA, uint256 voteB) {
        require(polls[pollId].exists, "Poll does not exist");
        Poll storage poll = polls[pollId];
        return (poll.voteA, poll.voteB);
    }

    function hasUserVoted(uint256 pollId, address user) external view returns (bool) {
        require(polls[pollId].exists, "Poll does not exist");
        return hasVoted[pollId][user];
    }

    function getUserChoice(uint256 pollId, address user) external view returns (uint8) {
        require(polls[pollId].exists, "Poll does not exist");
        return userChoice[pollId][user];
    }

    function isPollActive(uint256 pollId) external view returns (bool) {
        require(polls[pollId].exists, "Poll does not exist");
        return block.timestamp < polls[pollId].endTime;
    }

    function getCreatedPolls(address user) external view returns (uint256[] memory) {
        return createdPolls[user];
    }

    function getTotalVotes(uint256 pollId) external view returns (uint256) {
        require(polls[pollId].exists, "Poll does not exist");
        Poll storage poll = polls[pollId];
        return poll.voteA + poll.voteB;
    }

    function getWinner(uint256 pollId) external view returns (uint8) {
        require(polls[pollId].exists, "Poll does not exist");
        Poll storage poll = polls[pollId];

        if (poll.voteA > poll.voteB) {
            return 1;
        }

        if (poll.voteB > poll.voteA) {
            return 2;
        }

        return 0;
    }
}
