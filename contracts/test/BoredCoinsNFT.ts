import { ethers } from 'hardhat';
import { expect } from 'chai';

describe("BoredCoinsNFT", function () {
  it("create two tokens signed by the test", async function () {
    const BoredCoinsNFT = await ethers.getContractFactory("BoredCoinsNFT");
    const boredCoinsNFT = await BoredCoinsNFT.deploy("BNBBoredCoins", "BCBNB", 100);
    await boredCoinsNFT.deployed();

    const transaction1 = await boredCoinsNFT.createToken("https://myapi.com/1");
    await transaction1.wait();
    const transaction2 = await boredCoinsNFT.createToken("https://myapi.com/1");
    await transaction2.wait();

    const [testSigner] = await ethers.getSigners();
    const balanceOfTestSigner = await boredCoinsNFT.balanceOf(testSigner.address);
    expect(balanceOfTestSigner).equal(2);
  });

  it("throws on set max supply highest than 1000", async function () {
    const invalidMaxSupply = 1001;
    const BoredCoinsNFT = await ethers.getContractFactory("BoredCoinsNFT");

    expect(BoredCoinsNFT.deploy("BNBBoredCoins", "BCBNB", invalidMaxSupply)).to.be.revertedWith("");
  });

  it("throws on max supply reached", async function () {
    const maxSupply = 1;
    const BoredCoinsNFT = await ethers.getContractFactory("BoredCoinsNFT");
    const boredCoinsNFT = await BoredCoinsNFT.deploy("BNBBoredCoins", "BCBNB", maxSupply);
    await boredCoinsNFT.deployed();

    expect(boredCoinsNFT.createToken("https://myapi.com/1")).to.be.revertedWith("Max supply reached");
  });
});
