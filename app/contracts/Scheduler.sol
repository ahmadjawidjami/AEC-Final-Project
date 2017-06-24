contract SchedulerAPI {
    function scheduleCall(address contractAddress, bytes4 abiSignature, uint targetBlock) public returns (address);
}