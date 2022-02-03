// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.17;

contract Campaign {
    struct Request {
        uint256 value;
        string description;
        address recipient;
        bool completed;
        mapping(address => bool) votes;
        uint256 totalVotes;
    }

    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    address[] list_of_approvers;
    Request[] public requests;

    constructor(uint256 _minimumContribution) public {
        manager = msg.sender;
        minimumContribution = _minimumContribution;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        list_of_approvers.push(msg.sender);
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public onlyManager {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            completed: false,
            totalVotes: 0
        });
        requests.push(newRequest);
    }

    function getApprovers() public view returns (address[]) {
        return list_of_approvers;
    }

    function approve(uint256 request_index) public onlyApprovers {
        require(request_index >= 0 && request_index < requests.length);
        Request storage request = requests[request_index];
        require(!request.votes[msg.sender]);
        request.votes[msg.sender] = true;
        request.totalVotes++;
    }

    modifier onlyApprovers() {
        require(approvers[msg.sender]);
        _;
    }

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }
}
