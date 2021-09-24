"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var app = (0, express_1.default)();
var port = 8080;
// Middlewares for POST Request from Front-end
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// Function that evaluates the board state
function evaluate(boardState) {
    // Check first if the board state is valid
    // Check if it is an array and if its array length is 9
    if (!Array.isArray(boardState) || boardState.length !== 9) {
        return 'Invalid';
    }
    // These are the group of indices that form the lines in the board
    // Horizontal, Vertical, and Diagonal
    var lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    // Counter to check if the board is filled up
    var counter = 0;
    // Check each line in the board
    for (var x = 0; x < lines.length; x++) {
        var _a = lines[x], a = _a[0], b = _a[1], c = _a[2];
        // Add one to counter per line checked
        if (boardState[a] && boardState[b] && boardState[c]) {
            counter++;
        }
        // Check if a line is full of X's or O's
        // The winning condition
        if (boardState[a] &&
            boardState[a] === boardState[b] &&
            boardState[a] === boardState[c]) {
            return "Player " + boardState[a] + " has won the game!";
        }
    }
    // If counter is 8, it means nobody has won and it's a draw
    if (counter === 8) {
        return 'Draw! No more moves left.';
    }
    // Return null if nobody has won or it's not a draw yet
    return null;
}
// REST API Route
// Receive the POST request from the front-end
app.post('/', function (req, res) {
    if (req.body.boardState) {
        var boardState = req.body.boardState;
        // Evaluate the board state
        var message = evaluate(boardState);
        // Responses
        if (message === 'Invalid') {
            // Returns HTTP Code 400 (Bad Request) if board state is invalid
            return res.status(400).send({ message: 'Board state is invalid' });
        }
        else {
            // Returns HTTP Code 200 with the message from evaluation
            return res.status(200).send({ message: message });
        }
    }
    else {
        return res.status(400).send({ message: 'Request must have board state' });
    }
});
app.listen(port, function () {
    console.log("The server is listening on port " + port + "!");
});
