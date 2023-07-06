import { Grid } from "./grid.js"
import { Tile } from "./tile.js"

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);

grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
setupInputOnce();

function setupInputOnce() {
    window.addEventListener("keydown", hanleInput, { once: true });
}

 function hanleInput(event) {
    switch (event.key) {
        case "ArrowUp":
             moveUp();
            break;
        
        case "ArrowDown":
             moveDown();
            break;
        
        case "ArrowLeft":
             moveLeft();
            break;
    
        case "ArrowRight":
             moveRight();
            break;
        
        default:
            setupInputOnce(); 
            return;
    }

    const newTile = new Tile(gameBoard);
    grid.getRandomEmptyCell().linkTile(newTile);

    setupInputOnce(); 
}

async function moveUp() {
    await slideTiles(grid.cellsGroupedByColumn);
}

async function moveDown() {
    await slideTiles(grid.cellsGroupedByReversedColumn);
}

async function moveLeft() {
    await slideTiles(grid.cellsGroupedByRow);
}

async function moveRight() {
    await slideTiles(grid.cellsGroupedByReversedRow);
}

async function slideTiles(groupedCells) {
   


    groupedCells.forEach(group => slideTilesInGroup(group));

  

    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles();
    });

}

function slideTilesInGroup(group) {
    for (let i = 1; i < group.length; i++){
        if (group[i].isEmpty()) {
            continue;
        }
        const cellWidthTile = group[i];

        let targetCell;

        let j = i - 1;

        while (j >= 0 && group[j].canAccept(cellWidthTile.linkedTile)) {
            targetCell = group[j];
            j--;
        }

        if (!targetCell) {
            continue;
        }

    

        if (targetCell.isEmpty()) {
            targetCell.linkTile(cellWidthTile.linkedTile);
        } else {
            targetCell.linkTileForMerge(cellWidthTile.linkedTile);
        }

        cellWidthTile.unlinkTile();
    }
}