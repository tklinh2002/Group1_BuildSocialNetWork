pragma solidity 0.5.0;

contract SocialNetwork {
    uint public postCount = 0;

    mapping(uint => Post) public posts;
    mapping(address => mapping(uint => bool)) public addressVotes;
    mapping(uint => mapping (uint => address)) public voterOfPost;
    mapping(address => uint) public members;
    mapping(uint => address) public accounts;
    uint public numMember = 0;
    struct Post{
        uint id;
        string content;
        uint tipAmount;
        uint vote;
        address payable author;
    }

    event PostCreate(
        uint id,
        string content,
        uint tipAmount,
        uint vote,
        address payable author
    );

    event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    event Vote(
        uint id,
        address authorPost,
        address voter
    );

    event SignMember(
        address member,
        uint timestamp
    );

    function getVote(address addr, uint index) public view returns (bool) {
        return addressVotes[addr][index];
    }

    function createPost(string memory _content) public{
        // require valid content
        require(bytes(_content).length > 0);// if true continue excution 
        // Increment post
        postCount++;
        // create the post
        address payable payable_addr = address(uint160(msg.sender));
        posts[postCount] = Post(postCount, _content, 0, 0, payable_addr);
        // Trigger event
        emit PostCreate(postCount, _content, 0, 0, payable_addr);
    }

    function tipPost(uint _id) public payable {
        // make sure the id is valid
        require(_id > 0 && _id <= postCount);

        // fetch the post
        Post memory _post = posts[_id];
        // fetch the author
        address payable _author = _post.author;
        address payable payable_addr = address(uint160(_author));
        // pay the author by sending them Ether
        payable_addr.transfer(msg.value); // send and transfer just Object address payable not address
        // Incremet the tip amount
        _post.tipAmount = _post.tipAmount + msg.value;
        // update the post
        posts[_id] = _post;
        // trigger event
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
    }

    function votePost(uint _id) public payable{
        require(_id > 0 && _id <= postCount);
        address voter = address(uint160(msg.sender)); 
        require(addressVotes[voter][_id] == false);
        Post memory _post = posts[_id];
        
        voterOfPost[_id][_post.vote] = voter;
        _post.vote = _post.vote + 1;

        posts[_id] = _post;
        addressVotes[voter][_id] = true;
        // address payable payable_addr = address(uint160(0x31435210dA75eE90bE5d7f03a5AAB94015Fc3cC2));
        address payable payable_addr = address(uint160(_post.author));
        payable_addr.transfer(msg.value);

        emit Vote(_post.id, _post.author, voter);
    }

    function signMember() public payable{
        
        address member = address(uint160(msg.sender));
        require(members[member] == 0);
        address payable payable_addr = address(uint160(0x31435210dA75eE90bE5d7f03a5AAB94015Fc3cC2));
        payable_addr.transfer(msg.value);
        members[member] = block.timestamp;
        for(uint i = 0 ; i < numMember ;i++){
            if(accounts[i] == member){
                emit SignMember(member, block.timestamp);
                return;
            }
        }
        accounts[numMember] = member;
        numMember++;
        emit SignMember(member, block.timestamp);
    }

    function deleteMember(address author) public {
        members[author] = 0 ;
    }
}   