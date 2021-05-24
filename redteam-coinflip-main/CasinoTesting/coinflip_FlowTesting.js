let assert = require("assert");

const Coinflip = artifacts.require("./contracts/coinflip_testing.sol");

async function mustRevert(promise, message) {
  try {
    await promise;
    throw message;
  } catch (e) {
    if (e === message) throw message;
  }
}

let coinflip;

contract("Testing Overall Game Flow", (accounts) => {
  const casino = accounts[0];

  //Testing casino deposit function
  it("Should allow Casino deposit the bet", async () => {
    //Contract deployment
    coinflip = await Coinflip.new({ from: casino });
    await coinflip.depositMoney.sendTransaction({
      value: "50000000000000000000",
      from: accounts[0],
    });
  });

  it("Should let multiple users create a bet.", async () => {
    //Testing initializeGame()
    await coinflip.initializeGame.sendTransaction({
      value: "1000000000000000000",
      from: accounts[1],
    });
    await coinflip.initializeGame.sendTransaction({
      value: "500000000000000000",
      from: accounts[2],
    });
    await coinflip.initializeGame.sendTransaction({
      value: "100000000000000000",
      from: accounts[3],
    });
    await coinflip.initializeGame.sendTransaction({
      value: "300000000000000000",
      from: accounts[4],
    });
    await coinflip.initializeGame.sendTransaction({
      value: "700000000000000000",
      from: accounts[5],
    });

    assert.equal(
      await coinflip.mapGamestate.call(accounts[1]),
      1,
      "Initializing game went wrong in initializeGame() function"
    );

    assert.equal(
      await coinflip.mapGamestate.call(accounts[2]),
      1,
      "Initializing game went wrong in initializeGame() function"
    );

    assert.equal(
      await coinflip.mapGamestate.call(accounts[3]),
      1,
      "Initializing game went wrong in initializeGame() function"
    );

    assert.equal(
      await coinflip.mapGamestate.call(accounts[4]),
      1,
      "Initializing game went wrong in initializeGame() function"
    );

    assert.equal(
      await coinflip.mapGamestate.call(accounts[5]),
      1,
      "Initializing game went wrong in initializeGame() function"
    );
  });

  it("Should let the casino match different player's bet", async () => {
    //Testing casinoCommit()

    await coinflip.casinoCommit.sendTransaction(accounts[1]);
    await coinflip.casinoCommit.sendTransaction(accounts[2]);
    await coinflip.casinoCommit.sendTransaction(accounts[3]);
    await coinflip.casinoCommit.sendTransaction(accounts[4]);
    await coinflip.casinoCommit.sendTransaction(accounts[5]);
  });

  it("Should let users submit their choice", async () => {
    //Testing userSubmitChoice() function

    await coinflip.userSubmitChoice.sendTransaction(1, { from: accounts[1] });
    await coinflip.userSubmitChoice.sendTransaction(0, { from: accounts[2] });
    await coinflip.userSubmitChoice.sendTransaction(0, { from: accounts[3] });
    await coinflip.userSubmitChoice.sendTransaction(1, { from: accounts[4] });
    await coinflip.userSubmitChoice.sendTransaction(0, { from: accounts[5] });
  });

  it("Should let anyone execute reveal() and pay out if user wins", async () => {
    //Testing reveal() function

    await coinflip.reveal.sendTransaction(accounts[1], { from: casino });
    await coinflip.reveal.sendTransaction(accounts[2], { from: casino });
    await coinflip.reveal.sendTransaction(accounts[3], { from: accounts[3] });
    await coinflip.reveal.sendTransaction(accounts[4], { from: accounts[4] });
    await coinflip.reveal.sendTransaction(accounts[5], { from: accounts[5] });

    //Uncomment to check user balances by the end of the game
    // for (var i = 1; i < 6; i++) {
    //   const balance = await web3.eth.getBalance(accounts[i]);
    //   console.log(
    //     `User${i}'s balance: ` +
    //       balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    //   );
    // }
  });
});
