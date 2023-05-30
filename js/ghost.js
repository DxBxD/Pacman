'use strict'

const GHOST = `A`
const DEADGHOST = `H`
var gGhosts
var gDeadGhosts
var gIntervalGhosts

function createGhost(board, ghostLocation) {
    var ghost = {
        id: makeId(),
        location: ghostLocation,
        color: getRandomColor(),
        currCellContent: FOOD
    }
    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = GHOST
}

function createGhosts(board) {
    // 3 ghosts and an interval
    gGhosts = []
    gDeadGhosts = []

    var ghostLocations = [{i: 2, j: 3}, {i: 2, j: 4}, {i: 2, j: 5}, {i: 2, j: 6}]
    
    for (var i = 0; i < 4; i++) {
        createGhost(board, ghostLocations[i])
    }
    // console.log('gGhosts:', gGhosts)

    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    // loop through ghosts
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    if (ghost.isKilled && gPacman.isSuper) return
    // console.log('ghost.location:', ghost.location)
    const moveDiff = getMoveDiff()
    // console.log('moveDiff:', moveDiff)

    const nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    // console.log('nextLocation:', nextLocation)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]
    // console.log('nextCell:', nextCell)

    // return if cannot move
    if (nextCell === WALL) return
    if (nextCell === GHOST) return
    // hitting a pacman? call gameOver
    if (nextCell === PACMAN) {
        if (gPacman.isSuper) return
        gameOver(LOST_MSG)
        return
    }

    // moving from current location:
    // update the model (restore prev cell contents)
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // update the DOM
    renderCell(ghost.location, ghost.currCellContent)

    // Move the ghost to new location:
    // update the model (save cell contents)
    ghost.location = nextLocation
    ghost.currCellContent = nextCell
    gBoard[ghost.location.i][ghost.location.j] = GHOST

    // update the DOM
    renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

// function getGhostHTML(ghost) {
//     if (!gPacman.isSuper) {
//         return `<span style="color:${ghost.color}">${GHOST}</span>`
//     } else {
//         return`<span style="color:white">H</span>`
//     }
// }

function getGhostHTML(ghost) {
    const color = gPacman.isSuper ? 'white' : ghost.color
    const ghostType = gPacman.isSuper ? DEADGHOST : GHOST
    return `<span style="color:${color};">${ghostType}</span>`
}

function renderGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var currGhost = gGhosts[i]
        renderCell(currGhost.location, getGhostHTML(currGhost))
    }
}

function removeGhost(ghostI, ghostJ) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === ghostI && gGhosts[i].location.j === ghostJ) {
            const deadGhost = gGhosts.splice(i, 1)[0]
            checkGhostCellContent(deadGhost)
            gDeadGhosts.push(deadGhost)
            break
        }
    }
}

function checkGhostCellContent(ghost) {
    if (ghost.currCellContent === FOOD) {
        gFoodCounter--
        ghost.currCellContent = EMPTY
    }
}

function returnGhosts() {
    for (var i = 0; i < gDeadGhosts.length; i++) {
        gGhosts.push(gDeadGhosts[i])
    }
    gDeadGhosts = []
}