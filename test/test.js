const { expect } = require("chai");

describe("describe", function () {
  this.timeout(0);
  let test;

  {
    let initialized = false;
    let snapshot;

    beforeEach("run 13 txs", async () => {
      if (!initialized) {
        const [s] = await ethers.getSigners();

        await s.sendTransaction({ to: s.address });
        await s.sendTransaction({ to: s.address });
        await s.sendTransaction({ to: s.address });
        await s.sendTransaction({ to: s.address });
        await s.sendTransaction({ to: s.address });
        await s.sendTransaction({ to: s.address });
        await s.sendTransaction({ to: s.address });
        await s.sendTransaction({ to: s.address });
        await s.sendTransaction({ to: s.address });
        await s.sendTransaction({ to: s.address });
        await s.sendTransaction({ to: s.address });
        await s.sendTransaction({ to: s.address });
        await s.sendTransaction({ to: s.address });

        initialized = true;
        snapshot = await takeSnapshot();
      } else {
        await revert(snapshot);
      }
    });
  }

  describe("inner describe 1", () => {
    it("reverts", async () => {
      const test = await deploy("Test");
      await expect(test.fail()).to.be.revertedWith("");
    });
  });

  describe("inner describe 2", () => {
    {
      let initialized = false;
      let snapshot;
      beforeEach("create test", async () => {
        if (!initialized) {
          test = await deploy("Test");
          await test.get();

          initialized = true;
          snapshot = await takeSnapshot();
        } else {
          await revertSnapshot(snapshot);
        }
      });
    }
    it("reverts", async () => {
      await expect(test.fail()).to.be.revertedWith("");
    });
  });
});

async function deploy(contract) {
  const factory = await ethers.getContractFactory(contract);
  const instance = await factory.deploy();
  return instance.deployed();
}

async function takeSnapshot() {
  const result = await network.provider.request({
    method: "evm_snapshot"
  });

  return result;
}

async function revert(snapshotId) {
  const result = await network.provider.request({
    method: "evm_revert",
    params: [snapshotId]
  });

  if (!result) {
    console.trace();
    process.exit(1);
  }
}
