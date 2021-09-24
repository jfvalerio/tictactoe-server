import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
const port = 8080

// Middlewares for POST Request from Front-end
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Function that evaluates the board state
function evaluate(boardState: string[]) {
  // Check first if the board state is valid
  // Check if it is an array and if its array length is 9
  if (!Array.isArray(boardState) || boardState.length !== 9) {
    return 'Invalid'
  }

  // These are the group of indices that form the lines in the board
  // Horizontal, Vertical, and Diagonal
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  // Counter to check if the board is filled up
  let counter = 0

  // Check each line in the board
  for (let x = 0; x < lines.length; x++) {
    const [a, b, c] = lines[x]

    // Add one to counter per line checked
    if (boardState[a] && boardState[b] && boardState[c]) {
      counter++
    }

    // Check if a line is full of X's or O's
    // The winning condition
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      return `Player ${boardState[a]} has won the game!`
    }
  }

  // If counter is 8, it means nobody has won and it's a draw
  if (counter === 8) {
    return 'Draw! No more moves left.'
  }

  // Return null if nobody has won or it's not a draw yet
  return null
}

// REST API Route
// Receive the POST request from the front-end
app.post('/', (req, res) => {
  // Check if the request has board state
  if (req.body.boardState) {
    const { boardState } = req.body

    // Evaluate the board state
    const message = evaluate(boardState)

    // Responses
    if (message === 'Invalid') {
      // Returns HTTP Code 400 (Bad Request) if board state is invalid
      return res.status(400).send({ message: 'Board state is invalid' })
    } else {
      // Returns HTTP Code 200 with the message from evaluation
      return res.status(200).send({ message: message })
    }
  } else {
    // Returns HTTP Code 400 (Bad Request) if there is no board state passed
    return res.status(400).send({ message: 'Request must have board state' })
  }
})

app.listen(port, () => {
  console.log(`The server is listening on port ${port}!`)
})
