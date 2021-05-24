# smartcontract testing

We created another sol file for testing purpose because we need to have public getters to access maps in the smart contracts. But making these getters public might led to security issues. Therefore we decided to remove these getters in our offical smart contract and create another smart contract called "Coinflip_testing.sol" containing all the public getters.  
Follow these steps to test our smart contract:

1. Download Node.js at www.nodejs.org/en/
2. Install the downloaded package.
3. Open terminal
4. In terminal, type: npm version
5. A version of npm should be displayed, otherwise please troubleshoot accordingly
6. In terminal, type: sudo npm install -g truffle
7. In terminal, type: npm install --save-dev chai truffle-assertions, this will install the truffle-assertion package.
8. Create a folder somewhere
9. Change your directory in your terminal to the folder created in step 8
10. In terminal, type: truffle init, this command should initialize a folder for testing contracts
11. Open the folder that you created in step 8, you should see a folder called “test”, copy and paste our “coinflip_FlowTesting.js” and "coinflip_PhaseTesting.js" to this folder
12. Open the folder that you created in step 8, you should see a folder called “contract”, copy and paste our “coinflip_testing.sol” to this folder
13. Open the folder that you created in step 8, copy and paste our "truffl-config.js" file to the folder that you created, when alert prompt, click "Replace".
14. Open the folder that you created in step 8, go to "Migrations" folder, copy in "migration_coinflip.js" into this folder.
15. In terminal, type: truffle compile, this command will compile all smart contracts within the current folder.
16. In terminal, type: truffle test
17. You should be seeing the test result 😊.

Learn more about truffle-assertion package: </br>
https://github.com/rkalis/truffle-assertions </br>
https://kalis.me/assert-reverts-solidity-smart-contract-test-truffle/ </br>
