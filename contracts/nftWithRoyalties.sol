//SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC2981PerTokenRoyalties.sol";

contract nftWithRoyalties is
    ERC721URIStorage,
    Ownable,
    ERC721Enumerable,
    ERC2981PerTokenRoyalties
{
    uint256 nextTokenId;
    using Strings for uint256;
    using Counters for Counters.Counter;

    uint256 public maxSupply = 10000;
    //Supplies
    uint256 public vipSupply = 500;
    uint256 public premiumSupply = 1500;
    uint256 public category1Supply = 3000;
    uint256 public category2Supply = 5000;
    //Costs
    uint256 public vipCost = 0.01 ether;
    uint256 public premiumCost = 0.001 ether;
    uint256 public category1Cost = 0.0001 ether;
    uint256 public category2Cost = 0.00001 ether;
    uint256 public maxMintAmount = 50;
    string public baseURI =
        "ipfs://QmTB5PdoWCjF3braKi8mVvNFn8Ud3MpLVh3yg5dppH1aqs/";
    string public baseExtension = ".json";
    //Royaltie Variables
    address public royaltyRecipient;
    uint256 public royaltyValue = 1000;

    constructor() ERC721("Stadium", "STD") {}

    // ROYALTIE FUNCTIONS

    /// @inheritdoc	ERC165
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC2981Base, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    mapping(uint256 => string) tokenURIs;

    /// @notice Mint one token to `caller`
    /// @param caller the recipient of the token
    function mint(
        address caller,
        uint256 _mintAmount,
        uint256[] memory mytokenURI,
        uint256 _vipAmount,
        uint256 _premiumAmount,
        uint256 _category1Amount,
        uint256 _category2Amount
    ) external {
        uint256 supply = totalSupply();

        //REQUIRES
        require(_mintAmount <= maxMintAmount, "Exceeds Maximum Mint Amount");
        require(_mintAmount > 0, "Need to mint more than zero");
        require(
            supply + _mintAmount <= maxSupply,
            "There are not NFTs available to mint"
        );
        require(
            vipSupply - _vipAmount >= 0,
            "There are not Vip NFTs available to mint"
        );
        require(
            premiumSupply - _premiumAmount >= 0,
            "There are not Premium NFTs available to mint"
        );
        require(
            category1Supply - _category1Amount >= 0,
            "There are not Category 1 NFTs available to mint"
        );
        require(
            category2Supply - _category2Amount >= 0,
            "There are not Category 2 NFTs available to mint"
        );

        vipSupply = vipSupply - _vipAmount;
        premiumSupply = premiumSupply - _premiumAmount;
        category1Supply = category1Supply - _category1Amount;
        category2Supply = category2Supply - _category2Amount;

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(caller, (supply + i), "");
            _setTokenURI((supply + i), mytokenURI[i - 1].toString());
            tokenURIs[supply + i] = mytokenURI[i - 1].toString();

            if (royaltyValue > 0) {
                _setTokenRoyalty((supply + i), royaltyRecipient, royaltyValue);
            }
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenURIs[tokenId],
                        baseExtension
                    )
                )
                : "";
    }

    function tokenURIsOfHolder(address _holder)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_holder);
        uint256[] memory URIs = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            //contando com que a uri é igual ao tokenId
            URIs[i] = tokenOfOwnerByIndex(_holder, i);
        }
        return URIs;
    }

    // INTERNAL FUNCTIONS:

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // ONLY OWNER FUNCTIONS:

    function setRoyaltyRecipient(address _newRoyaltyRecipient)
        public
        onlyOwner
    {
        royaltyRecipient = _newRoyaltyRecipient;
    }

    function setRoyaltyValue(uint256 _newRoyaltyValue) public onlyOwner {
        royaltyValue = _newRoyaltyValue;
    }

    function setmaxSupply(uint256 _newmaxSupply) public onlyOwner {
        require(_newmaxSupply >= totalSupply(), "The Total Supply is Greater");
        maxSupply = _newmaxSupply;
    }

    function setVipCost(uint256 _newVipCost) public onlyOwner {
        require(_newVipCost >= 0, "Should be greater or equal than zero");
        vipCost = _newVipCost;
    }

    function setPremiumCost(uint256 _newPremiumCost) public onlyOwner {
        require(_newPremiumCost >= 0, "Should be greater or equal than zero");
        premiumCost = _newPremiumCost;
    }

    function setCategory1Cost(uint256 _newCategory1Cost) public onlyOwner {
        require(_newCategory1Cost >= 0, "Should be greater or equal than zero");
        category1Cost = _newCategory1Cost;
    }

    function setCategory2Cost(uint256 _newCategory2Cost) public onlyOwner {
        require(_newCategory2Cost >= 0, "Should be greater or equal than zero");
        category2Cost = _newCategory2Cost;
    }

    function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
        require(_newmaxMintAmount > 0, "Should be greater than zero");
        maxMintAmount = _newmaxMintAmount;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function withdraw() public payable onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }

    // FUNCTIONS are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
        onlyOwner
    {
        super._burn(tokenId);
    }
}
