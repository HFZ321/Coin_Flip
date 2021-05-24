import React, {useState,useRef,forwardRef, useImperativeHandle, Props} from 'react'
import Heads from '../Assets/heads.png'
import Tails from '../Assets/tails.png'
import styles from '../Components/Coin.module.scss'


const Coin =forwardRef((Props, ref)=>{


       const [animationFace, setAnimationFace]= useState(0)

       const coinAnimation=()=>{
              var result = 1
              window.handleInterval = setInterval(()=>{
                     (result == 1)? result = 0: result = 1
                     setAnimationFace(result)
              }, 300)
       }

       const setWinner=(face)=>{
              setAnimationFace(face)
       }

       const stopAnimation=()=>{
              clearInterval(window.handleInterval)
       }
       useImperativeHandle(ref, ()=> ({
              coinAnimation: coinAnimation,
              stopAnimation: stopAnimation,
              setWinner: setWinner
       }))

       if (animationFace == 0){
              return (
                     <div>
                            <img src={Heads} className={styles.coin}></img>
                     </div>

              )
       } else{
              return (
                     <div>
                            <img src={Tails} className={styles.coin}></img>
                     </div>
              )
       }
})

export default Coin;