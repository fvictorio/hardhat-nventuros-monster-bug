pragma solidity ^0.7.0;

contract Test {
    function get() external view returns (uint) {
        return 1;
    }

    function fail() external {
      require(false);
    }
}
