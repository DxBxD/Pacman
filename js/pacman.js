'use strict'

const PACMAN = '<img src="img/pacman.png">'
var gPacman

function createPacman(board) {
    gPacman = {
        location: {
            i: 7,
            j: 7
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
    gFoodCounter--
}

function onMovePacman(ev) {
    if (!gGame.isOn) return

    const nextLocation = getNextLocation(ev)
    console.log('nextLocation:', nextLocation)
    if (!nextLocation) return

    const nextCell = gBoard[nextLocation.i][nextLocation.j]
    console.log('nextCell:', nextCell)
    // return if cannot move
    if (nextCell === WALL) return
    // if eats powerfood
    if (nextCell === POWERFOOD) {
        if(gPacman.isSuper) return
        gPacman.isSuper = true
        renderGhosts()
        setTimeout(() => {
            gPacman.isSuper = false
            returnGhosts()
            renderGhosts()
        }, 5000)
    }
    // hitting a ghost?
    if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            removeGhost(nextLocation.i, nextLocation.j)
        } else {
        gameOver(LOST_MSG)
            return
        }
    }
    if (nextCell === CHERRIES) {
        updateScore(10)
    } 
    // moving from current location:
    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // update the DOM
    renderCell(gPacman.location, EMPTY)

    // Move the pacman to new location:
    // update the model
    gPacman.location = nextLocation
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
    // update the DOM
    renderCell(gPacman.location, PACMAN)

    if (nextCell === FOOD) {
        gFoodCounter--
        updateScore(1)
        checkIfFoodLeft()
    }
}

function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    // console.log('eventKeyboard.code:', eventKeyboard.code)

    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--
            gNextDirection = 'up'
            break
        case 'ArrowDown':
            nextLocation.i++
            gNextDirection = 'down'
            break
        case 'ArrowRight':
            nextLocation.j++
            gNextDirection = 'right'
            break
        case 'ArrowLeft':
            nextLocation.j--
            gNextDirection = 'left'
            break
        default: return null
    }

    return nextLocation
}