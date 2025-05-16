const options = ["rock", "paper", "scissors"]
const resultText = document.querySelector(".result")
resultText.innerText = ""
const movesCounter = document.querySelector(".moves")
movesCounter.innerText = 10
const playerScore = document.querySelector(".player-score")
const computerScore = document.querySelector(".cpu-score")

function won(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return null
    if (playerChoice === "rock" && computerChoice === "scissors"
        || playerChoice === "paper" && computerChoice === "rock"
        || playerChoice === "scissors" && computerChoice === "paper"
    ) return true
    return false
}

function onclick(e) {
    const selection = e.target.innerText.toLowerCase()
    const computerSelection = options[Math.floor(Math.random() * options.length)]
    const result = won(selection, computerSelection)
    resultText.innerText = `You chose ${selection}, the computer chose ${computerSelection}`
    if (result === true) {
        resultText.innerHTML += `<br>You won the round!`
        playerScore.innerText = parseInt(playerScore.innerText) + 1
    } else if (result === false) {
        resultText.innerHTML += `<br>You lost the round...`
        computerScore.innerText = parseInt(computerScore.innerText) + 1
    } else {
        resultText.innerHTML += `<br>It's a draw`
    }
    movesCounter.innerText = parseInt(movesCounter.innerText) - 1
    if (movesCounter.innerText == 0) {
        if (parseInt(playerScore.innerText) > parseInt(computerScore.innerText))
            resultText.innerHTML += `<br>You won the game!`
        else if (parseInt(playerScore.innerText) < parseInt(computerScore.innerText))
            resultText.innerHTML += `<br>You lost the game o7`
        else resultText.innerHTML += `<br>It all ends in a draw`
        document.querySelectorAll(".options button").forEach(b => b.style.pointerEvents = "none")
        document.querySelector(".reload").style.display = "block"
    }
}

document.querySelector(".rock").addEventListener("click", onclick)
document.querySelector(".paper").addEventListener("click", onclick)
document.querySelector(".scissors").addEventListener("click", onclick)
document.querySelector(".reload").addEventListener("click", () => window.location.reload())

