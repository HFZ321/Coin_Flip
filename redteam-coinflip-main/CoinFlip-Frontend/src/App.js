import React, {useState, useRef, useEffect} from 'react'
import Coin from './Components/Coin'
import Status from './Components/Status'
import GameResult from './Components/GameResult'
import styles from './App.module.scss'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import Loader from 'react-loader-spinner'
import Web3 from 'web3'
import {casinoAbi} from './Abis/casinoAbi.js'
function App() {

       //WEB3 CONTRACT CONFIG
       const web3 = new Web3(Web3.givenProvider)
       const casinoContractAddress = '0x3E0cbF76846fe2801F7f0f4D3bF87343C99ee7bC'
       const casinoContract = new web3.eth.Contract(casinoAbi, casinoContractAddress)

       //CONFETTI CONFIG
       const {width, height} = useWindowSize()

       //USER STATE
       const [userAddress, setUserAddress]= useState('')
       const [userBet, setUserBet]=useState('')
       const [userBetAmount, setUserBetAmount]=useState(0)
       const [maxBet, setMaxBet]=useState('')
       const [statusMessage, setStatusMessage]= useState('')
       const [gameResult, setGameResult]= useState('')
       const [inputError, setInputError]=useState('')
       const [deniedMessage, setDeniedMessage]=useState('')
       const [winnings, setWinnings]=useState(0)
       const [winningFace, setWinningFace]=useState(0)
       const [testState, setTestState]=useState(0)
       const [loading, setLoading]=useState(false)
       const minBet = 0.001


       //ANIMATION STATE
       // const [animation, setAnimation]=useState('ready')
       // const [animationFace, setAnimationFace]=useState(0)
       
       //GAME PHASE STATE
       const [gameState, setGameState]=useState(0)

       //GRANT METAMASK ACCESS
       const grantAccess=async (e)=>{
              e.preventDefault();

              if (typeof window.ethereum !== 'undefined') {
                     console.log('MetaMask is installed!');
                     let ethereum = window.ethereum
                     const accounts = await ethereum.request({method: 'eth_requestAccounts'})
                     const account = accounts[0]
                     setUserAddress(account)
                     const pulledWinnings = await casinoContract.methods.viewWinnings().call({from: account })
                     const ETHwinnings = parseFloat(web3.utils.fromWei(pulledWinnings))
                     setWinnings(ETHwinnings)

              }else{
                     console.log('please install metamask')
              }

       }

       useEffect(()=>{
              setTotalWinnings()
       }, [winnings])

       //USER BET SELECTION. HEADS = 0, TAILS = 1
       const handleSelection=(e)=>{
              if(e.target.value === 'heads'){
                     setUserBet(0)
              }else if (e.target.value === 'tails'){
                     setUserBet(1)
              }
       }

       //TAKES USER BET AMOUNT INPUT, CONVERTS TO STRING, AND SETS STATE
       const handleBetAmount= (e)=>{
              setUserBetAmount(parseFloat(e.target.value))
       }

       //MONITOR PHASE 2. AWAIT GAME PHASE TO BE AT PHASE 3 BEFORE CALLING INITIATE PHASE THREE
       const monitorPhase2Status=async ()=>{
              const timer = ms => new Promise(res => setTimeout(res, ms))
              var gamePhase = getGamePhase()
              while(gamePhase != 2){
                     var gamePhase = await getGamePhase()
                     console.log("GAME_PHASE:", gamePhase)
                     await timer(5000)
              }
              if(gamePhase == 2){
                     console.log('CASINO HAS COMMITED. PHASE TWO DONE.')
                     setGameState(gamePhase)
                     await initiatePhaseThree()
              }
       }

       const submitBet=async (error)=>{
              if(error.length === 0){
                     //INITIATE PHASE ONE
                     let initiateGame = await initiatePhaseOne()

                     //INITIATE PHASE THREE
                     let monitor = await monitorPhase2Status()

                     //INITIATE PHASE FOUR
                     let reveal = await initiatePhaseFour()
                     
                     // await viewResults()

                     let winnings = await viewWinnings()
                     setTotalWinnings(winnings)
                     // }
              }else{
                     console.log('fix input errors')
              }

       }

       const formValidation=async (e)=>{
              e.preventDefault()
              let max = await getMax()
              let maxFloat= parseFloat(max)
              if(userBetAmount > max){
                     var error = `Please enter a bet below ${maxFloat} ETH`
                     await setInputError('Please enter a bet below', maxFloat, 'ETH')
              } else if(userBetAmount < minBet){
                     var error = `Please enter a bet above ${minBet} ETH`
                     await setInputError('Please enter a bet amount above', minBet, ' ETH')
              } else{
                     var error = ''
              }
              setInputError(error)
              submitBet(error)
       }

       const getGamePhase =async ()=>{
              let gamePhase = await casinoContract.methods.mapGamestate(userAddress).call({from: userAddress})
              return gamePhase
       }

       //PHASE ONE - initialize game
       const initiatePhaseOne= async ()=>{
              setLoading(true)
              console.log('BEGIN PHASE ONE...')
              setGameResult('')
              setStatusMessage('Awaiting transaction confirmation...')
              setDeniedMessage('')
              try{
                     await casinoContract.methods.initializeGame().send({from: userAddress, to: casinoContractAddress, value: web3.utils.toWei(userBetAmount.toString())})
                     console.log('initialized game - PHASE ONE, CLEAR.')
                     setStatusMessage('Waiting for casino choice, hang tight :)')
              } catch (error){
                     setLoading(false)
                     if (error.code === 4001){
                            setStatusMessage('')
                            setDeniedMessage(`You've denied the transaction.`)
                     }
              }
       }

       //PHASE THREE - user submit choice
       const initiatePhaseThree= async ()=>{
              setStatusMessage('Submitting user bet choice... :)')
              console.log('BEGIN PHASE THREE...')
              try{
                     await casinoContract.methods.userSubmitChoice(userBet).send({from: userAddress, to: casinoContractAddress})
                     console.log('submitted user choice - PHASE THREE, CLEAR.')
              } catch (error){
                     setLoading(false)
                     if (error.code === 4001){
                            setStatusMessage('')
                            setDeniedMessage(`You've denied the transaction.`)
                     }
              }
       }

       //PHASE FOUR - reveal
       const initiatePhaseFour= async()=>{
              setStatusMessage('Preparing payout...')
              console.log('BEGIN PHASE FOUR...')
              try{
                     callAnimation()
                     const result = await casinoContract.methods.reveal(userAddress).send({from: userAddress, to: casinoContractAddress})
                     await setResults()
                     stopAnimation()
                     passWinningFace(winningFace)
                     setLoading(false)
                     setStatusMessage('Payout issued! Thanks for playing.')
                     console.log(result)
                     console.log('Revealed! - PHASE FOUR, CLEAR.')

              }catch(error){
                     setLoading(false)
                     if (error.code === 4001){
                     setStatusMessage('')
                     setDeniedMessage(`You've denied the transaction.`)
                     }
              }
       }

       const getMaxBet=async ()=>{
              let maxBet = await casinoContract.methods.maxBet().call({from: userAddress})
              let maxBetinETH = web3.utils.fromWei(maxBet)
              setMaxBet(maxBetinETH)
       }
       //only call these 2 functions after reveal phase is over
       const setResults = async()=>{
              let result = await casinoContract.methods.viewResults().call({from: userAddress })
              if (result == 2){
                     setWinningFace(userBet)
                     setGameResult('You Won! :) Payout issued to wallet.')
              } else if (result == 3){
                     if(userBet== 0){
                            setWinningFace(1) 
                     }else if(userBet == 1){
                            setWinningFace(0)
                     }
                     setGameResult('Sorry, you lost.')
              }
       }

       const childRef = useRef()

       const callAnimation =()=>{
              childRef.current.coinAnimation()
       }
       const stopAnimation=()=>{
              childRef.current.stopAnimation()
       }

       const passWinningFace=(winningFace)=>{
              childRef.current.setWinner(winningFace)
       }
       

       const viewWinnings = async()=>{
              let winnings = await casinoContract.methods.viewWinnings().call({from: userAddress })
              let ETHwinnings = parseFloat(web3.utils.fromWei(winnings))
              console.log(ETHwinnings)
              return ETHwinnings
       }

       const setTotalWinnings = async()=>{
              const winnings = await casinoContract.methods.viewWinnings().call({from: userAddress })
              const ETHwinnings = web3.utils.fromWei(winnings)
              setWinnings(parseFloat(ETHwinnings))
       }

       const getMax=async ()=>{
              let maxBet = await casinoContract.methods.maxBet().call({from: userAddress})
              let maxBetinETH = web3.utils.fromWei(maxBet)
              return maxBetinETH
       }

       const showMaxBet=async ()=>{
              let maxBet = await casinoContract.methods.maxBet().call({from: userAddress})
              let maxBetinETH = web3.utils.fromWei(maxBet)
              setMaxBet(maxBetinETH)
       }
       if (userAddress == ''){
              return (
                     <div className={styles.App}>
                            <div className={styles.gameContainer}>
                                   <div className={styles.header}>Coinflip - Team RED</div>
                                   <div className={styles.gameWrapper}>
                                          <div className={styles.leftSide}>
                                                 <div className={styles.metaMask}>
                                                        <div className={styles.welcomeMsg}>
                                                               Welcome to Coin Flip. Grant MetaMask access below to start playing.
                                                        </div>
                                                        <div className={styles.metamaskButton}>
                                                               <button id={styles.button} onClick={grantAccess}>Grant MetaMask access</button>
                                                        </div>
                                                 </div>                                   
                                          </div>  
                                          <div className={styles.coinContainer}>
                                                 <Coin face={winningFace} ref={childRef}/>
                                                 <Status status={statusMessage}/>
                                                 {(gameResult != '')? <GameResult result={gameResult}/>: null}
                                                 {(inputError != '')? <div>{inputError}</div>: null}
                                                 {(deniedMessage != '')?<div>{deniedMessage}</div>: null}
                                          </div>
                                   </div>
                            </div>
                            <div className={styles.credits}>
                                   <div className={styles.credits}>
                                          Arun Ajay 
                                   </div>
                                   <div className={styles.credits}>
                                          Ali Belaj 
                                   </div>
                                   <div className={styles.credits}>
                                          Hong Chen 
                                   </div>
                                   <div className={styles.credits}>
                                          Chengliang Tan 
                                   </div>
                                   <div className={styles.credits}>
                                          Lihan Zhan 
                                   </div>
                                   <div className={styles.credits}>
                                          Hong Fei Zheng 
                                   </div>
                            </div>
                     </div>
              )
              }else{
                     return (
                            <div className={styles.App}>
                                   <div className={styles.gameContainer}>
                                          <div className={styles.header}>Coinflip - Team RED</div>
                                          <div className={styles.gameWrapper}>
                                                 <div className={styles.leftSide}>
                                                        <form className={styles.formSection}>
                                                               <div className={styles.betChoice}>
                                                                      <label>Enter bet:   </label>
                                                                      <select onChange={handleSelection}>
                                                                             <option value="heads">Heads</option>
                                                                             <option value="tails">Tails</option>
                                                                      </select>
                                                               </div>
                                                               <div className={styles.betAmount}>
                                                                      <label>Bet Amount (ETH):</label>
                                                                      <input onClick={showMaxBet}onChange={handleBetAmount}type="number" min="0.1"/>
                                                               </div>
                                                               <div className={styles.maxBet}>
                                                                      {(maxBet)?
                                                                      <div className={styles.notification}>
                                                                             <div>*Maximum Bet Amount:</div>
                                                                             <div>{maxBet} ETH *</div>
                                                                      </div>: null}
                                                               </div>
                                                        </form>
                                                        <button onClick={formValidation}>Place bet</button>
                                                 </div>  
                                                 <div className={styles.coinContainer}>
                                                        <Coin ref={childRef}/>
                                                        {(gameResult.includes('You Won!'))?<Confetti width={width} height={height}/>:null}
                                                        <Status status={statusMessage}/>
                                                        <div className={styles.errorBox}>
                                                               {(loading)?<Loader type="TailSpin" height={35} width={35} color="#327DF0" />: null}
                                                               {(gameResult != '')? <GameResult result={gameResult}/>: null}
                                                               {(inputError != '')? <div>{inputError}</div>: null}
                                                               {(deniedMessage != '')?<div>{deniedMessage}</div>: null}
                                                        </div>
                                                 </div>
                                                 <div className={styles.analyticsContainer}>
                                                       <div className={styles.winningsHeader}>Your total winnings</div>
                                                       {(winnings)?<div className={styles.winnings}>{winnings} ETH</div>: <div>none</div>}
                                                 </div>
                                          </div>
                                   </div>
                                   <div className={styles.credits}>
                                          <div className={styles.credits}>
                                                 Arun Ajay 
                                          </div>
                                          <div className={styles.credits}>
                                                 Ali Belaj 
                                          </div>
                                          <div className={styles.credits}>
                                                 Hong Chen 
                                          </div>
                                          <div className={styles.credits}>
                                                 Chengliang Tan 
                                          </div>
                                          <div className={styles.credits}>
                                                 Lihan Zhan 
                                          </div>
                                          <div className={styles.credits}>
                                                 Hong Fei Zheng 
                                          </div>
                                   </div>
                            </div>
                     );
       }
}

export default App;
