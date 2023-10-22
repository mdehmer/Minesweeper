// var sizeOption;
var numCols = 0;
var numRows = 0;
var numCells = numCols * numRows;
// var difficulty;
var numMines = 0;
var numFlagsPlaced = numMines;
var gameStarted = false;
var mineCoordinates = [];
var tileGrid;
var uncoveredTiles;
const leftMouseButton = 1;
const rightMouseButton = 3;

var statsHeight = Number($("#stats").css("height").split("p")[0]);
var navHeight = Number($("#bottom-navbar nav").css("height").split("p")[0]);
var maxHeight = Number($(window).height() - statsHeight - navHeight - 50);
var maxWidth = Number($("#board").css("width").split("p")[0]);
const minSize = 44; //pixels
var minMaxGrid = new MinMaxGrid();

var seconds = 0;
var minutes = 0;
var interval;

const mineSymbol =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi d-block mx-auto mb-1" viewBox="0 0 16 16"><path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/><path d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5zm1 4.5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3A1.5 1.5 0 0 1 6.5 5z"/></svg>';
const flagSymbol =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi d-block mx-auto mb-1" viewBox="0 0 16 16"><path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/></svg>';

const defaultEmojiPath =
  '<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zM4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z"/>';
const winEmojiPath =
  '<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM2.31 5.243A1 1 0 0 1 3.28 4H6a1 1 0 0 1 1 1v.116A4.22 4.22 0 0 1 8 5c.35 0 .69.04 1 .116V5a1 1 0 0 1 1-1h2.72a1 1 0 0 1 .97 1.243l-.311 1.242A2 2 0 0 1 11.439 8H11a2 2 0 0 1-1.994-1.839A2.99 2.99 0 0 0 8 6c-.393 0-.74.064-1.006.161A2 2 0 0 1 5 8h-.438a2 2 0 0 1-1.94-1.515L2.31 5.243zM4.969 9.75A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .866-.5z"/>';
const loseEmojiPath =
  '<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM4.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM8 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>';

// Load the whole board (only blank tiles)
loadCoveredBoard();

// ===================================================
// EVENT LISTERNERS
// ===================================================

// Event listener for detecting changes in window size so the grid dimensions updates
$(window).on("resize", function (e) {
  statsHeight = Number($("#stats").css("height").split("p")[0]);
  navHeight = Number($("#bottom-navbar nav").css("height").split("p")[0]);
  maxHeight = Number($(window).height() - statsHeight - navHeight - 50);
  maxWidth = Number($("#board").css("width").split("p")[0]);
  minMaxGrid = new MinMaxGrid();

  loadSettings();
});

// Event listener for clicking each tile
$("#board").on("mousedown", ".boardCell", function (event) {
  var coordinates = event.target.id; //Store the coordinates for the board cell that was clicked on
  var mouseClick = event.originalEvent.which; //Store the mouse button that was clicked (left/right)
  var x = Number(coordinates.split("-")[0]);
  var y = Number(coordinates.split("-")[1]);

  uncoverTile(x, y, mouseClick);
});

// Event listener for the start button
$("#startBtn").on("click", function (e) {
  clearInterval(interval);
  $("#startBtn svg").html(defaultEmojiPath); // Change back to normal after game over
  $("#startBtn").removeClass("btn-danger btn-success"); // Change back to normal after game over
  $("#startBtn").addClass("btn-primary"); // Change back to normal after game over
  gameStarted = false;
  numFlagsPlaced = numMines;
  $("#numRemainingMines").removeClass("text-danger");

  //Reset the timer
  minutes = 0;
  seconds = 0;
  $("#seconds").text("00");
  $("#minutes").text("00");

  loadCoveredBoard(); //Reload the covered board
});

// ===================================================
// GAMEPLAY
// ===================================================

function uncoverTile(x, y, mouseClick) {
  // Only for the first tile that is clicked, which starts the game
  if (gameStarted == false) {
    startGame(x, y);
  }

  var tile = tileGrid[x][y];

  // Left click
  if (mouseClick === leftMouseButton) {
    // Check if the tile is flagged, this should just remove the flag without uncovering it
    if (tile.state === "covered") {
      uncoveredTiles[x][y] = true;
      tile.state = "uncovered";
      if (tile.content !== 0) {
        $("#" + tile.coordinates).html(tile.content);
      }
      $("#" + tile.coordinates).addClass("uncovered");
      // $("#" + tile.coordinates).attr("disabled", "true");

      if (tile.isMine == true) {
        gameOver(tile);
        return;
      } else if (tile.numAdjacent < 1) {
        uncoverAdjacentTiles(tile);
      }
    } else if (tile.state === "flagged") {
      // Toggle the flag when left-clicking on a flagged tile
      toggleFlag(tile);
    }
  } else if (mouseClick === rightMouseButton) {
    toggleFlag(tile);
  }

  applyStyle(tile, "");

  checkWinCondition();
}

function applyStyle(tile, detonatedMileCoordinates) {
  var defaultClasses = "boardCell ";
  var classesToAdd = defaultClasses;
  var classesToRemove = "";

  if (tile.isMine && tile.state === "uncovered") {
    if (tile.coordinates === detonatedMileCoordinates) {
      //Apply special style to the mine that triggered
      classesToAdd += "mine detonated ";
      classesToRemove += "";
    } else {
      //Apply style to remaining mines
      classesToAdd += "mine ";
    }
  }

  if (tile.state === "uncovered") {
    classesToAdd += `${tile.state} `;
    if (!tile.isMine) {
      classesToAdd += `tile${tile.numAdjacent} `;
    }
  } else {
    classesToAdd += `${tile.state} `;
    if (tile.state === "sweeped") { $("#" + tile.coordinates).html(mineSymbol); }
  }

  $("#" + tile.coordinates).attr("class", classesToAdd);
}

function uncoverAdjacentTiles(tile) {
  // Array of relative coordinates of adjacent tiles
  var neighbors = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (var i = 0; i < neighbors.length; i++) {
    var xOffset = neighbors[i][0];
    var yOffset = neighbors[i][1];
    var x = tile.xCoordinate + xOffset;
    var y = tile.yCoordinate + yOffset;

    // Check if the neighboring tile is within the board bounds
    if (x >= 0 && x < numRows && y >= 0 && y < numCols) {
      var neighborTile = tileGrid[x][y];

      // Check if the neighboring tile is not a mine and is covered
      if (!neighborTile.isMine && neighborTile.state === "covered") {
        neighborTile.state = "uncovered";
        uncoveredTiles[x][y] = true;
        if (neighborTile.numAdjacent > 0) {
          $("#" + neighborTile.coordinates).html(neighborTile.content);
        }
        $("#" + neighborTile.coordinates).addClass("uncovered");
        applyStyle(neighborTile);

        // $("#" + neighborTile.coordinates).prop("disabled", true);

        // If the neighboring tile has no adjacent mines, recursively uncover its neighbors
        if (neighborTile.numAdjacent === 0) {
          uncoverAdjacentTiles(neighborTile);
        }
      }
    }
  }
}

function toggleFlag(tile) {
  var x = tile.xCoordinate;
  var y = tile.yCoordinate;

  if (tile.state === "flagged") {
    //The tile is already flagged, remove it and change back to covered
    numFlagsPlaced++;
    $("#" + tile.coordinates).html("");
    uncoveredTiles[x][y] = false; // Remove it from list of uncovered tiles
    tile.state = "covered";
  } else if (tile.state === "covered") {
    //The tile is covered, add the flag
    numFlagsPlaced--;
    // $("#" + tile.coordinates).addClass("uncovered");
    $("#" + tile.coordinates).html(flagSymbol);
    tile.state = "flagged";
  }

  //Style counter
  updateFlagCounter();

  tileGrid[x][y] = tile;
}

function updateFlagCounter() {
  if (numFlagsPlaced < -9) {
    $("#numRemainingMines").html("-" + Math.abs(numFlagsPlaced));
  } else if (numFlagsPlaced < 0) {
    $("#numRemainingMines").html("-0" + Math.abs(numFlagsPlaced));
    $("#numRemainingMines").addClass("text-danger");
  } else if (numFlagsPlaced < 10) {
    $("#numRemainingMines").html("00" + numFlagsPlaced);
  } else if (numFlagsPlaced < 100) {
    $("#numRemainingMines").html("0" + numFlagsPlaced);
  } else {
    $("#numRemainingMines").html(numFlagsPlaced);
  }
}

function startGame(firstX, firstY) {
  gameStarted = true;
  initializeGrid(firstX, firstY);
  startTimer();
}

function gameOver(tile) {
  console.log("Mine detonated");
  clearInterval(interval);

  for (var x = 0; x < numRows; x++) {
    for (var y = 0; y < numCols; y++) {
      var activeTile = tileGrid[x][y];
      if (activeTile.state === "covered") {
        if (activeTile.numAdjacent != 0 || activeTile.isMine) {
          $("#" + activeTile.coordinates).html(activeTile.content);
        }
        $("#" + activeTile.coordinates).addClass("uncovered");
        // $("#" + activeTile.coordinates).html(activeTile.content);
        activeTile.state = "uncovered";
      }
      applyStyle(activeTile, tile.coordinates);
    }
  }

  //Style the start button
  $("#startBtn svg").html(loseEmojiPath);
  $("#startBtn").addClass("btn-danger");
  $("#startBtn").removeClass("btn-outline-primary");
}

function checkWinCondition() {
  // Checks if all mines have been flagged and remaining tiles have been uncovered
  var allMinesFlagged = true;
  var allOtherTilesUncovered = true;

  for (var x = 0; x < numRows; x++) {
    for (var y = 0; y < numCols; y++) {
      var tile = tileGrid[x][y];

      if (tile.isMine && tile.state !== "flagged" && tile.state !== "sweeped") {
        // If any mine is not flagged, the player hasn't won yet
        allMinesFlagged = false;
        break;
      }

      if (!tile.isMine && tile.state !== "uncovered") {
        // If any non-mine tile is not uncovered, the player hasn't won yet
        allOtherTilesUncovered = false;
        break;
      }
    }
  }

  if (allMinesFlagged && allOtherTilesUncovered) {
    // If all mines are flagged and all other tiles are uncovered, the player wins
    console.log("Congratulations! You've won!");
    clearInterval(interval);

    // Change all flags to state "sweeped" instead (for styling)
    for (var x = 0; x < numRows; x++) {
      for (var y = 0; y < numCols; y++) {
        if (tileGrid[x][y].state === "flagged") {
          tileGrid[x][y].state = "sweeped";
          applyStyle(tileGrid[x][y], "");
        }
      }
    }

    $("#startBtn svg").html(winEmojiPath); // Change back to normal after game over
    $("#startBtn").removeClass("btn-outline-primary"); // Change back to normal after game over
    $("#startBtn").addClass("btn-success"); // Change back to normal after game over
  }
}

// ===================================================
// GAME SETUP
// ===================================================
function loadCoveredBoard() {
  loadSettings();
  // Ensure the board is empty
  $("#board").html("");
  updateFlagCounter();

  // Build the row (x)
  for (var x = 0; x < numRows; x++) {
    $("#board").append(`<div class='boardRow' id='row${x}'></div>`);

    // Build the tiles along the row (y)
    for (var y = 0; y < numCols; y++) {
      $(`#board #row${x}`).append(
        `<button type="button" class="boardCell" id="${x}-${y}"></button>`
      );
    }
  }

  // calculateGridSize();
}

function initializeGrid(firstX, firstY) {
  tileGrid = Array.from({ length: numRows }, () => Array(numCols).fill(0));
  uncoveredTiles = Array.from({ length: numRows }, () =>
    Array(numCols).fill(false)
  );
  placeMines(firstX, firstY);

  for (var x = 0; x < numRows; x++) {
    for (var y = 0; y < numCols; y++) {
      var tile = new Tile(x, y, false, "covered", 0);

      if (tileGrid[x][y] === mineSymbol) {
        //The tile is a mine
        tile.isMine = true;
        tile.content = mineSymbol;
      } else {
        // The tile is either number or adjacent
        tile.numAdjacent = placeNumbers(tile);
        tile.content = tile.numAdjacent;
      }

      tileGrid[x][y] = tile;
    }
  }
}

function placeMines(firstX, firstY) {
  mineCoordinates = Array(numMines).fill(0);

  // Generate all coordinates for the mines
  for (var i = 0; i < numMines; i++) {
    var row, col;
    do {
      row = Math.floor(Math.random() * numRows);
      col = Math.floor(Math.random() * numCols);
      var isFirst = tileGrid[row][col] === tileGrid[firstX][firstY];
    } while (
      tileGrid[row][col] === mineSymbol || // Check if it's already a mine
      (row === firstX && col === firstY)
    ); //Check if it's the first tile
    tileGrid[row][col] = mineSymbol;
    mineCoordinates[i] = row + "-" + col;
  }
}

function placeNumbers(t) {
  var numAdjacentMines = 0;
  // t is a tile without a mine
  //Create an array of all adjacent tiles (to the mine); N, NE, E, SE, S, SW, W, NW
  var coordinates = [
    //E.g. Mine at 4-4
    `${t.xCoordinate - 1}-${t.yCoordinate}`, //N 3-4
    `${t.xCoordinate - 1}-${t.yCoordinate + 1}`, //NE 3-5
    `${t.xCoordinate}-${t.yCoordinate + 1}`, //E 4-5
    `${t.xCoordinate + 1}-${t.yCoordinate + 1}`, //SE 5-5
    `${t.xCoordinate + 1}-${t.yCoordinate}`, //S 5-4
    `${t.xCoordinate + 1}-${t.yCoordinate - 1}`, //SW 5-3
    `${t.xCoordinate}-${t.yCoordinate - 1}`, //W 4-3
    `${t.xCoordinate - 1}-${t.yCoordinate - 1}`, //NW 3-3
  ];

  for (var i = 0; i < coordinates.length; i++) {
    if (mineCoordinates.includes(coordinates[i])) {
      numAdjacentMines++;
    }
  }

  return numAdjacentMines;
}

function startTimer() {
  clearInterval(interval);
  interval = setInterval(function () {
    seconds++;
    if (seconds <= 9) {
      $("#seconds").html("0" + seconds);
    }

    if (seconds > 9) {
      $("#seconds").html(seconds);
    }

    if (seconds > 59) {
      minutes++;
      $("#minutes").html("0" + minutes);
      seconds = 0;
      $("#seconds").html("0" + seconds);
    }

    if (minutes > 9) {
      $("#minutes").html(minutes);
    }

    if (minutes > 59) {
      $("#minutes").html("--");
      $("seconds").html("--");
      // clearInterval(interval);
    }
  }, 1000);
}

function Tile(x, y, isMine, state, numAdjacent) {
  this.xCoordinate = x;
  this.yCoordinate = y;
  this.coordinates = `${x}-${y}`;
  this.isMine = isMine;
  this.state = state;
  this.numAdjacent = numAdjacent;
  this.content = "";
}
