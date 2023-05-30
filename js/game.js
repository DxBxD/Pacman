'use strict'

const WALL = '<img src="img/wall.png">'
const FOOD = '◽'
const POWERFOOD = '🥙'
const EMPTY = ' '
const CHERRIES = '🍒'
const WON_MSG = 'YOU WON! <span style="font-size:36px; font-family:\'Pacman\'">H</span>'
const LOST_MSG = 'YOU LOST! <span style="font-size:36px; font-family:\'Pacman\'">Z</span>'

const gGame = {
    score: 0,
    isOn: false
}

var gBoard
var gNextDirection
var gIntervalCherries
var gFoodCounter = 0

function onInit() {

    console.log('hello')
        
    clearInterval(gIntervalGhosts)
    clearInterval(gIntervalCherries)

    gGame.score = 0
    updateScore(0)
    
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'

    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)

    renderBoard(gBoard)
    renderGhosts()
    gGame.isOn = true

    gIntervalCherries = setInterval(() => {
        addCherries()
    }, 15000)
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD
            gFoodCounter++

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
                gFoodCounter--
            }

            if ((i === 1 && j === 1) ||
                (i === 1 && j === size - 2) ||
                (i === size - 2 && j === 1) ||
                (i === size - 2 && j === size - 2)) {
                board[i][j] = POWERFOOD
                gFoodCounter--
            }
        }
    }
    console.log('board:', board)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
    elCell.classList.remove('up')
    elCell.classList.remove('down')
    elCell.classList.remove('right')
    elCell.classList.remove('left')
    if (value === PACMAN) {
        elCell.classList.add(gNextDirection)
    }
}

function updateScore(diff) {
    // update model and dom
    gGame.score += diff
    document.querySelector('h2 span').innerText = gGame.score
}

function checkIfFoodLeft() {
    // for (var i = 0; i < gBoard.length; i++) {
    //     for (var j = 0; j < gBoard[0].length; j++) {
    //         if (gBoard[i][j] === FOOD) {
    //             return
    //         }
    //     }
    // }
    if (gFoodCounter !== 0) return
    gameOver(WON_MSG)
    return
}

function addCherries() {
	var i = getRandomIntInclusive(1, gBoard.length - 2)
	var j = getRandomIntInclusive(1, gBoard[0].length - 2)
	var targetCell = gBoard[i][j]
	var loopCounter = 0
	const cellNum = (gBoard.length - 2) * (gBoard[0].length - 2)
	while (targetCell !== EMPTY) {
		if (loopCounter === cellNum * 3000) return
		var i = getRandomIntInclusive(1, gBoard.length - 2)
		var j = getRandomIntInclusive(1, gBoard[0].length - 2)
		targetCell = gBoard[i][j]
        loopCounter++
	}
    gBoard[i][j] = CHERRIES
	renderCell({ 'i': i, 'j': j }, CHERRIES)
}

function gameOver(msg) {
    console.log('Game Over')
    gGame.isOn = false
    gFoodCounter = 0
    clearInterval(gIntervalGhosts)
    // clearInterval(gIntervalPowerFood)
    clearInterval(gIntervalCherries)
    renderCell(gPacman.location, EMPTY)
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    var elMsg = elModal.querySelector('.msg')
    elMsg.innerHTML = msg
}