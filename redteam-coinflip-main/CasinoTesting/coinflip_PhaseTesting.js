const CoinFlip = artifacts.require("Coinflip_testing.sol");

const truffleAssert = require("truffle-assertions");

const gasFee = 20000000000;

contract("Deposite and Withdrawal Testing", async (accounts) => {
  it("Should prevent other accounts to deposite", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[1];
    let depositeFund = 10000000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //user tries to deposite into smart contract(should not work)
    truffleAssert.fails(
      instance.depositMoney({ from: account_user, value: depositeFund })
    );
  });

  it("Should prevent other accounts from withdrawal", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[1];
    let depositeFund = 10000000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //user tries to withdrawal from smart contract(should not work)
    truffleAssert.fails(instance.withdrawMoney({ from: account_user }));
  });

  it("Should Deposite 10ETH into Smart Contract", async () => {
    let account_casino = accounts[0];
    let depositeFund = 10000000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //obtain casino balance before deposite
    const casinoBalanceBefore = await web3.eth.getBalance(account_casino);
    console.log("casinoBalanceBefore = ", casinoBalanceBefore);
    //casino deposite money into smart contract
    const deposite = await instance.depositMoney({
      from: account_casino,
      value: depositeFund,
    });
    //calculate gas fee for deposite
    const gasFeeforDeposite = deposite.receipt.gasUsed * gasFee;
    console.log("gasFeeforDeposite = ", gasFeeforDeposite);
    //calculate correct casino balance after deposite
    const correctCasinoBalanceAfter =
      Number(casinoBalanceBefore) -
      Number(gasFeeforDeposite) -
      Number(depositeFund);
    console.log("correctCasinoBalanceAfter = ", correctCasinoBalanceAfter);
    //obtain casino balance after deposite
    const casinoBalanceAfter = await web3.eth.getBalance(account_casino);
    console.log("casinoBalanceAfter = ", casinoBalanceAfter);
    //obtain smart contract balance
    const smartContractBalance = await web3.eth.getBalance(instance.address);
    //assert smart contract balance = 10ETH
    assert.equal(smartContractBalance, depositeFund);
    //assert fund was taken out from casino account balance
    assert.equal(correctCasinoBalanceAfter, casinoBalanceAfter);
  });

  it("Should withdraw money from smart Contract", async () => {
    let account_casino = accounts[0];
    let depositeFund = 10000000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino balance before deposite
    const casinoBalanceBeforeDeposite = await web3.eth.getBalance(
      account_casino
    );
    console.log("casinoBalanceBeforeDeposite = ", casinoBalanceBeforeDeposite);
    //casino deposite money into smart contract
    const deposite = await instance.depositMoney({
      from: account_casino,
      value: depositeFund,
    });
    //casino balance after deposite
    const casinoBalanceAfterDeposite = await web3.eth.getBalance(
      account_casino
    );
    console.log("casinoBalanceAfterDeposite = ", casinoBalanceAfterDeposite);
    //casino withdraw money from smart contract
    const withdrawal = await instance.withdrawMoney({ from: account_casino });
    //gas fee for withdrawal
    const gasFeeforWithdrawal = withdrawal.receipt.gasUsed * gasFee;
    console.log("gasFeeforWithdrawal = ", gasFeeforWithdrawal);
    //obtain smart contract balance
    const smartContractBalance = await web3.eth.getBalance(instance.address);
    //obtain casino balance after withdraw
    const casinoBalanceAfterWithdrawl = await web3.eth.getBalance(
      account_casino
    );
    console.log("casinoBalanceAfterWithdrawl = ", casinoBalanceAfterWithdrawl);
    //calculate correct balance for casino account after withdrawal
    let correctCasinoBalanceAfterWithdrawl =
      Number(casinoBalanceBeforeDeposite) +
      depositeFund -
      Number(gasFeeforWithdrawal);
    console.log(
      "correctCasinoBalanceAfterWithdrawl = ",
      correctCasinoBalanceAfterWithdrawl
    );
    console.log("smartContractBalance = ", smartContractBalance);
    assert.equal(smartContractBalance, 0);
    assert.equal(
      Math.round(correctCasinoBalanceAfterWithdrawl / 1000000000000000000),
      Math.round(casinoBalanceAfterWithdrawl / 1000000000000000000)
    );
  });
});

contract("phase 1", async (accounts) => {
  //phase 1 testing
  it("Should be Inactive gameState", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[1];

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //obtain GameState from map
    const gameState = await instance.getGamestateByKey.call(account_user);
    assert.equal(gameState.toString(), 0);
  });

  it("Should initialize game state to CasinoCommit", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[1];
    let depositeFund = 10000000000000000000;
    let betAmount = 100000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ value: depositeFund });
    //player starts a game
    await instance.initializeGame({ from: account_user, value: betAmount });
    //obtain GameState from map
    const gameState = await instance.getGamestateByKey.call(account_user);
    assert.equal(gameState.toString(), 1);
  });

  it("Should deduct user balance base on what the bet was", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[7];
    let depositeFund = 10000000000000000000;
    let betAmount = 500000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ value: depositeFund });
    //player starts a game
    const balanceBefore = await web3.eth.getBalance(account_user);
    let hash = await instance.initializeGame({
      from: account_user,
      value: betAmount,
    });
    const gasUsed = hash.receipt.gasUsed;

    //check address balance
    const balance = await web3.eth.getBalance(account_user);
    let balanceTest =
      Number(balance) + Number(betAmount) + Number(gasUsed) * Number(gasFee);
    assert.equal(
      Math.round(balanceTest / 100000000000000000),
      Math.round(balanceBefore / 100000000000000000)
    );
  });

  it("Should put 500 finney as bet amount", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[2];
    let depositeFund = 10000000000000000000;
    let betAmount = 500000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ value: depositeFund });
    //player starts a game
    await instance.initializeGame({ from: account_user, value: betAmount });
    //obtain bet amount from map
    const gameBet = await instance.getBetByKey.call(account_user);
    //check address balance
    const balance = await web3.eth.getBalance(account_user);
    assert.equal(gameBet.toString(), betAmount);
  });

  it("Should stop casino from initalizing game", async () => {
    let account_casino = accounts[0];
    let depositeFund = 10000000000000000000;
    let betAmount = 100000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ value: depositeFund });
    //casino start a game(should not work)
    truffleAssert.fails(
      instance.initializeGame({ from: account_casino, value: betAmount })
    );
  });

  it("Should stop player from starting a second game", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[3];
    let depositeFund = 10000000000000000000;
    let betAmount = 100000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ value: depositeFund });
    //player start a game
    await instance.initializeGame({
      from: account_user,
      value: betAmount,
    });
    //player starts a second game(should not work)
    truffleAssert.fails(
      instance.initializeGame({ from: account_user, value: betAmount })
    );
  });

  it("Should not satisfy min bet", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[4];
    let depositeFund = 10000000000000000000;
    let betAmount = 10000; //10000 wei

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ from: account_casino, value: depositeFund });
    //player start a game with too little bet
    truffleAssert.fails(
      instance.initializeGame({ from: account_user, value: betAmount })
    );
  });

  it("Should exceed max bet", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[5];
    let depositeFund = 10000000000000000000;
    let betAmount = 10000000000000000000; //10 ether

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ from: account_casino, value: depositeFund });
    //player start a game with too much bet
    truffleAssert.fails(
      instance.initializeGame({ from: account_user, value: betAmount })
    );
  });
});

contract("phase 2", async (accounts) => {
  //phase 2 testing
  it("Should stop player use casino commit", async () => {
    let account_casino = accounts[0];
    let betAmount = 100000000000000000;
    let depositAmount = 10000000000000000000;
    let account_user = accounts[1];
    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino start a game(should not work)
    await instance.depositMoney({ from: account_casino, value: depositAmount });
    truffleAssert.fails(
      instance.casinoCommit(account_user, {
        from: account_user,
      })
    );
  });

  it("Should prevent casino change choice after user commit", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[3];
    let betAmount = 100000000000000000;
    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //obtain GameState from map
    await instance.initializeGame({ from: account_user, value: betAmount });
    await instance.casinoCommit(account_user, {
      from: account_casino,
    });
    await instance.userSubmitChoice(1, { from: account_user });
    truffleAssert.fails(
      instance.casinoCommit(account_user, {
        from: account_casino,
      })
    );
  });

  it("Should make sure casino's choice is valid", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[2];
    let betAmount = 100000000000000000;
    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //obtain GameState from map
    await instance.initializeGame({ from: account_user, value: betAmount });
    await instance.casinoCommit(account_user, {
      from: account_casino,
    });
    const key = await instance.getCasinoRandomByKey.call(account_casino);
    let condition;
    if (key == 0) {
      condition = 1;
    } else if (key == 1) {
      condition = 1;
    } else {
    }
    assert.equal(condition, 1);
  });

  it("Should deduct casino balance base on what the bet was", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[6];
    let betAmount = 500000000000000000;
    let depositAmount = 10000000000000000000;
    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });

    //player starts a game
    await instance.initializeGame({ from: account_user, value: betAmount });
    const balanceBefore = await web3.eth.getBalance(account_casino);
    let hash = await instance.casinoCommit(account_user, {
      from: account_casino,
    });
    await instance.depositMoney({ from: account_casino, value: depositAmount });
    //check address balance
    const gasUsed = hash.receipt.gasUsed;
    let balance = await web3.eth.getBalance(account_casino);
    let balanceTest =
      Number(balance) +
      Number(depositAmount) +
      Number(gasFee) * Number(gasUsed);

    assert.equal(
      Math.round(balanceTest / 1000000000000000000),
      Math.round(balanceBefore / 1000000000000000000)
    );
  });

  it("Should check if the game state is correct before phase 2", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[4];
    let betAmount = 100000000000000000;
    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //obtain GameState from map
    await instance.initializeGame({ from: account_user, value: betAmount });
    const gameState = await instance.getGamestateByKey.call(account_user);
    assert.equal(gameState.toString(), 1);
  });

  it("Should check if the game state is correct before phase 3", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[5];
    let betAmount = 100000000000000000;
    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //obtain GameState from map
    await instance.initializeGame({ from: account_user, value: betAmount });
    await instance.casinoCommit(account_user, {
      from: account_casino,
    });
    const gameState = await instance.getGamestateByKey.call(account_user);
    assert.equal(gameState.toString(), 2);
  });
});

contract("phase 3", async (accounts) => {
  //phase 3 testing
  it("Should change game state to Reveal", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[1];
    let depositeFund = 10000000000000000000;
    let betAmount = 100000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ from: account_casino, value: depositeFund });
    //player start a game
    await instance.initializeGame({ from: account_user, value: betAmount });
    //casino commits
    await instance.casinoCommit(account_user, {
      from: account_casino,
    });
    //player commit 0 as their choices
    await instance.userSubmitChoice(0, { from: account_user });
    const gameState = await instance.getGamestateByKey.call(account_user);
    // console.log(gameState);
    // console.log(gameState.toString());
    assert.equal(gameState.toString(), 3);
  });

  it("Should set 1 as player's choice", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[2];
    let depositeFund = 10000000000000000000;
    let betAmount = 100000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ from: account_casino, value: depositeFund });
    //player start a game
    await instance.initializeGame({ from: account_user, value: betAmount });
    //casino commits
    await instance.casinoCommit(account_user, {
      from: account_casino,
    });
    //player commit 0 as their choices
    await instance.userSubmitChoice(1, { from: account_user });
    const playerChoice = await instance.getUserChoiceByKey.call(account_user);
    assert.equal(playerChoice.toString(), 1);
  });

  it("Should not be able to submit player choices outside of phase 3", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[3];
    let depositeFund = 10000000000000000000;
    let betAmount = 100000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ from: account_casino, value: depositeFund });
    //player commit choices without starting a game
    truffleAssert.fails(instance.userSubmitChoice(0, { from: account_user }));
  });

  it("Should not be able to accept choices other than 0 or 1", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[4];
    let depositeFund = 10000000000000000000;
    let betAmount = 100000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ from: account_casino, value: depositeFund });
    //player start a game
    await instance.initializeGame({ from: account_user, value: betAmount });
    //casino commits
    await instance.casinoCommit(account_user, {
      from: account_casino,
    });
    //player commit choices other than 0 and 1
    truffleAssert.fails(instance.userSubmitChoice(100, { from: account_user }));
  });
});

contract("phase 4", async (accounts) => {
  //phase 2 testing

  it("Should add balance to winner correctly.", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[9];
    // 1 ether bet amount
    let betAmount = 1000000000000000000;
    //copy down casino & player's initial balance before game
    let depositAmount = 10000000000000000000;
    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //phase 1 - 2 - 3 - 4
    await instance.depositMoney({ from: account_casino, value: depositAmount });
    await instance.initializeGame({ from: account_user, value: betAmount });

    await instance.casinoCommit(account_user, {
      from: account_casino,
    });
    await instance.userSubmitChoice(1, { from: account_user });
    const CasinoChoice = await instance.getCasinoSecretChoiceByKey.call(
      account_user
    );
    const UserChoice = await instance.getUserChoiceByKey.call(account_user);
    const CasinoBalanceBefore = await web3.eth.getBalance(account_casino);
    const UserBalanceBefore = await web3.eth.getBalance(account_user);
    let hash = await instance.reveal(account_user, { from: account_user });
    const gasUsed = hash.receipt.gasUsed;
    //player win
    if (Number(CasinoChoice) == Number(UserChoice)) {
      let balanceAfter = await web3.eth.getBalance(account_user); // player balance after game
      let balanceTest =
        Number(UserBalanceBefore) +
        Number(betAmount) * 2 -
        Number(gasUsed) * Number(gasFee); // player initial balance + bet amount

      assert.equal(
        Math.round(balanceTest / 100000000000000000),
        Math.round(balanceAfter / 100000000000000000)
      );
    }
    //casino win
    else {
      await instance.withdrawMoney({ from: account_casino });
      let balanceAfter = await web3.eth.getBalance(account_casino); // casino balance after game
      let balanceTest =
        Number(CasinoBalanceBefore) + Number(betAmount) + Number(depositAmount); //casino initial balance + bet amount
      assert.equal(
        Math.round(balanceTest / 100000000000000000),
        Math.round(balanceAfter / 100000000000000000)
      );
    }
  });

  it("Should tell user win or lose.", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[5];
    // 1 ether bet amount
    let betAmount = 1000000000000000000;
    //copy down casino & player's initial balance before game
    let depositAmount = 10000000000000000000;
    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //phase 1 - 2 - 3 - 4
    await instance.depositMoney({ from: account_casino, value: depositAmount });
    await instance.initializeGame({ from: account_user, value: betAmount });

    await instance.casinoCommit(account_user, {
      from: account_casino,
    });
    await instance.userSubmitChoice(1, { from: account_user });
    const CasinoChoice = await instance.getCasinoSecretChoiceByKey.call(
      account_user
    );
    const UserChoice = await instance.getUserChoiceByKey.call(account_user);
    const CasinoBalanceBefore = await web3.eth.getBalance(account_casino);
    const UserBalanceBefore = await web3.eth.getBalance(account_user);
    await instance.reveal(account_user, { from: account_user });

    //player win
    if (Number(CasinoChoice) == Number(UserChoice)) {
      const gameResult = await instance.getGameResult.call(account_user);
      assert.equal(gameResult.toString(), 2);
    }
    //casino win
    else {
      const gameResult = await instance.getGameResult.call(account_user);
      assert.equal(gameResult.toString(), 3);
    }
  });

  it("Should prevent players enter this state without correct game phase.", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[8];
    let betAmount = 100000000000000000;
    let depositAmount = 10000000000000000000;
    //casino deploys contract  await instance.withdrawMoney({ from: account_casino});
    const instance = await CoinFlip.deployed({ from: account_casino });
    await instance.depositMoney({ from: account_casino, value: depositAmount });
    //obtain GameState from map
    await instance.initializeGame({ from: account_user, value: betAmount });
    await instance.casinoCommit(account_user, {
      from: account_casino,
    });
    truffleAssert.fails(instance.reveal(account_user, { from: account_user }));
  });

  it("Should reset game state after game complete", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[5];
    let betAmount = 100000000000000000;
    let depositAmount = 10000000000000000000;
    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //obtain GameState from map
    await instance.depositMoney({ from: account_casino, value: depositAmount });
    await instance.initializeGame({ from: account_user, value: betAmount });
    await instance.casinoCommit(account_user, {
      from: account_casino,
    });
    await instance.userSubmitChoice(1, { from: account_user });
    await instance.reveal(account_user, { from: account_user });
    const gameState = await instance.getGamestateByKey.call(account_user);
    assert.equal(gameState.toString(), 0);
  });
});

contract("cancelBet Testing", async (accounts) => {
  it("Should cancel bet", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[1];
    let depositeFund = 10000000000000000000;
    let betAmount = 100000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ from: account_casino, value: depositeFund });
    //player start a game
    await instance.initializeGame({ from: account_user, value: betAmount });
    //make game session expire
    await instance.setTimeforTesting(account_user, { from: account_casino });
    //player cancel their bet
    await instance.cancelBet({ from: account_user });
    //check if values stored in map is reset
    const Gamestate = await instance.getGamestateByKey.call(account_user);
    assert.equal(Gamestate.toString(), 0);
  });

  it("Should transfer game bet back to player balance", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[2];
    let depositeFund = 10000000000000000000;
    let betAmount = 100000000000000000;
    const balanceBefore = await web3.eth.getBalance(account_user);

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ from: account_casino, value: depositeFund });
    //player start a game
    const tx = await instance.initializeGame({
      from: account_user,
      value: betAmount,
    });
    //check player balance after started a game
    const gasUsed = tx.receipt.gasUsed;
    const balance = await web3.eth.getBalance(account_user);
    //make game session expire
    await instance.setTimeforTesting(account_user, { from: account_casino });
    //player calls cancelBet
    await instance.cancelBet({ from: account_user });
    let balanceTest =
      Number(balance) + Number(betAmount) + Number(gasFee) * Number(gasUsed);
    assert.equal(
      Math.round(balanceTest / 100000000000000000),
      Math.round(balanceBefore / 100000000000000000)
    );
  });

  it("Should not be able to cancel bet, did not reach expire time", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[3];
    let depositeFund = 10000000000000000000;
    let betAmount = 100000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ from: account_casino, value: depositeFund });
    //player start a game
    await instance.initializeGame({ from: account_user, value: betAmount });
    //player calls cancelBet within expire time
    truffleAssert.fails(instance.cancelBet({ from: account_user }));
  });

  it("Should not be able to cancel bet, no active game", async () => {
    let account_casino = accounts[0];
    let account_user = accounts[4];
    let depositeFund = 10000000000000000000;

    //casino deploys contract
    const instance = await CoinFlip.deployed({ from: account_casino });
    //casino deposite money into smart contract
    await instance.depositMoney({ from: account_casino, value: depositeFund });
    //player calls cancelBet when no game is active
    truffleAssert.fails(instance.cancelBet({ from: account_user }));
  });
});
