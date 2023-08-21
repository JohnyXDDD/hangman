import { useEffect, useRef, useState } from 'react';
import images from './images.js';
export default function Hangman() {
    const firstTime = useRef(true)
    const [availableLetters, setAvailableLetter] = useState([...'qwertyuiopasdfghjklzxcvbnm'])
    const [password, setPassword] = useState(null)
    const [lifes, setLifes] = useState(8)
    const [isPlayable, setIsPlayable] = useState(true)
    const [hashedPassword, setHashedPassword] = useState(null)
    const alphabet = [...'qwertyuiopasdfghjklzxcvbnm']
    useEffect(() => {
        lifes === 0 && setIsPlayable(false)
    }, [lifes])
    useEffect(() => {
        hashedPassword === password && password !== null && setIsPlayable(false)
    }, [hashedPassword])
    useEffect(() => {
        password && setHashedPassword(hashPassword())
    }, [password])
    useEffect(() => {
        if (firstTime.current) {
            firstTime.current = false
            fetch("https://random-word-api.herokuapp.com/word?lang=en")
                .then(res => res.json())
                .then(data => setPassword(data[0]))
        }
    }, [])
    useEffect(() => {
        isPlayable && password && fetch("https://random-word-api.herokuapp.com/word?lang=en")
            .then(res => res.json())
            .then(data => setPassword(data[0]))
    }, [isPlayable])
    const first_row = alphabet.slice(0, 10).map((letter) => buttonCreator(letter))
    const second_row = alphabet.slice(10, 19).map((letter) => buttonCreator(letter))
    const third_row = alphabet.slice(19, 26).map((letter) => buttonCreator(letter))
    function buttonCreator(letter) {
        const wrong = { backgroundColor: "#f94b5b", color: "#FAF0E6" }
        const correct = { backgroundColor: "#0b8c0b", color: "#FAF0E6" }
        const style = !availableLetters.includes(letter) ? password.includes(letter) ? correct : wrong : null
        return (
            <button key={letter}
                onClick={availableLetters.includes(letter) && isPlayable ? () => keyClick(letter) : null}
                style={style}>{letter}
            </button>
        )
    }
    function keyClick(letter) {
        let newHashedPassword = hashedPassword.split('')
        let wasCorrect = false
        for (let i = 0; i < hashedPassword.length; i++) {
            if (password[i] === letter) {
                newHashedPassword[i] = letter
                wasCorrect = true
            }
        }
        wasCorrect ? setHashedPassword(newHashedPassword.join('')) : setLifes((prevState) => prevState - 1)

        setAvailableLetter(prevState => prevState.filter(prevLetter => prevLetter !== letter))
    }

    function playAgain() {
        setIsPlayable(true)
        setLifes(8)
        setAvailableLetter([...'qwertyuiopasdfghjklzxcvbnm'])
    }

    function hashPassword() {
        if (password) {
            let hashed = ""
            for (let i = 0; i < password.length; i++) {
                password[i] === " " ? hashed += " " : hashed += "-"
            }
            return hashed
        }
    }
    return (
        <section className='gameArea'>
            <img src={images[lifes]} alt="hangman" />
            <h2 className='password'>{hashedPassword}</h2>
            <div className='keyboard'>
                <div className='row'>{first_row}</div>
                <div className='row'>{second_row}</div>
                <div className='row'>{third_row}</div>
            </div>
            {!isPlayable &&
                <div className='modal'>
                    <h2>{lifes ? "You Won!!!" : "You Lose!!!"}</h2>
                    <p>{lifes ? `Remaining lifes: ${lifes}` : `Correct password: ${password}`}</p>
                    <button onClick={playAgain}>Play again</button>
                </div>
            }
        </section>
    )
}