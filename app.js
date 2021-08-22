document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid');
  const scoreDisplay = document.getElementById('score');
  const highScoreDisplay = document.getElementById('highScore');
  const resultDisplay = document.getElementById('result');

  const tileColors = {
    0: 'rgb(204,192,179)',
    2: 'rgb(238,228,218)',
    4: 'rgb(237,224,200)',
    8: 'rgb(242,177,121)',
    16: 'rgb(245,149,99)',
    32: 'rgb(246,124,95)',
    64: 'rgb(246,94,59)',
    128: 'rgb(237,207,114)',
    256: 'rgb(237,204,97)',
    512: 'rgb(237,200,80)',
    1024: 'rgb(237,197,63)',
    2048: 'rgb(237,194,46)',
    4096: 'rgb(62,57,51)',
  };

  const width = 4;
  const numberCells = [];
  let score = 0;
  let hiScore;

  //create your board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const numberCell = document.createElement('div')
      numberCell.setAttribute('id', i)
      numberCell.innerHTML = '0'
      grid.appendChild(numberCell)
      numberCells.push(numberCell)
    }
    generateRandomTile();
    generateRandomTile();
  }

  function generateRandomTile() {
    let randomCell = Math.floor(Math.random() * width * width);
    if (numberCells[randomCell].innerHTML === "0") {
      numberCells[randomCell].innerHTML = "2";
      checkForGameOver();
    } else {
      generateRandomTile();
    }
  }

  function moveTllesHorizontal(direction) {
    for (let i = 0; i < width; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        row.push(parseInt(numberCells[i * width + j].innerHTML));
      }

      let filteredRow = row.filter(n => n);
      let missingCount = width - filteredRow.length;
      let zerosArray = Array(missingCount).fill('0');

      let newRow = direction == 'ltr' ? zerosArray.concat(filteredRow) : filteredRow.concat(zerosArray);
      for (let j = 0; j < width; j++) {
        numberCells[width * i + j].innerHTML = newRow[j];
      }
    }
  }

  function moveTilesVertical(direction) {
    for (let i = 0; i < width; i++) {
      let column = [];
      for (let j = 0; j < width; j++) {
        column.push(parseInt(numberCells[i + j * width].innerHTML));
      }

      let filteredColumn = column.filter(n => n);
      let missingCount = width - filteredColumn.length;
      let zerosArray = Array(missingCount).fill('0');

      let newRow = direction == 'up' ? filteredColumn.concat(zerosArray) : zerosArray.concat(filteredColumn);
      for (let j = 0; j < width; j++) {
        numberCells[i + j * width].innerHTML = newRow[j];
      }
    }
  }

  function combineRow() {
    for (let i = 0; i < width; i++) { // row
      for (let j = 0; j < width - 1; j++) { // column (took 1 less than width as no need to check for last element )
        if (numberCells[i * width + j].innerHTML === numberCells[i * width + j + 1].innerHTML) {
          let total = parseInt(numberCells[i * width + j].innerHTML) + parseInt(numberCells[i * width + j + 1].innerHTML);
          numberCells[i * width + j].innerHTML = total;
          numberCells[i * width + j + 1].innerHTML = "0";

          score += total;
          updateScore();
        }
      }
    }
    checkforWin();
  }

  function combineColumn() {
    for (let i = 0; i < width; i++) { // row
      for (let j = 0; j < width - 1; j++) { //col
        if (numberCells[j * width + i].innerHTML === numberCells[(j + 1) * width + i].innerHTML) {
          let total = parseInt(numberCells[j * width + i].innerHTML) + parseInt(numberCells[(j + 1) * width + i].innerHTML);
          numberCells[j * width + i].innerHTML = total;
          numberCells[(j + 1) * width + i].innerHTML = "0";

          score += total;
          updateScore();
        }
      }
    }
    checkforWin();
  }

  function checkforWin() {
    for (let i = 0; i < width * width; i++) {
      if (numberCells[i].innerHTML === '2048') {
        resultDisplay.innerHTML = 'You WIN'
      }
    }
  }

  function checkForGameOver() {
    let isGameOver = true;
    const emptyBoxes = numberCells.filter(cell => cell.innerHTML == "0");
    if (emptyBoxes.length) {
      isGameOver = false;
    }
    else {
      // check if move is possible
      for (let i = 0; i < width; i++) { // row
        for (let j = 0; j < width - 1; j++) { // column (took 1 less than width as no need to check for last element )
          if (numberCells[i * width + j].innerHTML === numberCells[i * width + j + 1].innerHTML) {
            isGameOver = false;
            break;
          }
        }
        if (!isGameOver) {
          break;
        }
      }

      for (let i = 0; i < width; i++) { // row
        for (let j = 0; j < width - 1; j++) { //col
          if (numberCells[j * width + i].innerHTML === numberCells[(j + 1) * width + i].innerHTML) {
            isGameOver = false;
            break;
          }
        }
        if (!isGameOver) {
          break;
        }
      }

    }

    if (isGameOver) {
      resultDisplay.innerHTML = 'You LOSE';
    }
  }

  function updateScore() {
    scoreDisplay.innerHTML = score;
    if (score > hiScore) {
      hiScore = score;
      localStorage.setItem("highScore", JSON.stringify(hiScore));
      highScoreDisplay.innerHTML = hiScore;
    }
  }

  function readHighScroe() {
    hiScore = localStorage.getItem("highScore");
    if (hiScore === null) {
      hiScore = 0;
      localStorage.setItem("highScore", JSON.stringify(hiScore))
    }
    else {
      hiScore = JSON.parse(hiScore);
      highScoreDisplay.innerHTML = hiScore;
    }
  }

  function keyUp() {
    moveTilesVertical('up');
    combineColumn();
    moveTilesVertical('up');
    generateRandomTile();
  }

  function keyDown() {
    moveTilesVertical('down');
    combineColumn();
    moveTilesVertical('down');
    generateRandomTile();
  }

  function keyLeft() {
    moveTllesHorizontal('rtl');
    combineRow();
    moveTllesHorizontal('rtl')
    generateRandomTile();
  }

  function keyRight() {
    moveTllesHorizontal('ltr');
    combineRow();
    moveTllesHorizontal('ltr');
    generateRandomTile();
  }

  function init() {
    createBoard();
    readHighScroe();
    setTileColors();
    setInterval(setTileColors, 100);
  }

  window.addEventListener('keydown', e => {
    switch (e.key) {
      case "ArrowUp":
        keyUp();
        break;

      case "ArrowDown":
        keyDown();
        break;

      case "ArrowLeft":
        keyLeft();
        break;

      case "ArrowRight":
        keyRight();
        break;
    }
  });

  function getTileBackgroundColor(value) {
    return tileColors[value];
  }

  function getTileTextColor(text) {
    const value = parseInt(text);
    if (value === 0) {
      return 'rgb(204,192,179)'
    } else if (value <= 4) {
      return 'rgb(119,110,101)';
    } else {
      return 'rgb(255,255,255)';
    }
  }

  function setTileColors() {
    for (let i = 0; i < width * width; i++) {
      numberCells[i].style.backgroundColor = getTileBackgroundColor(numberCells[i].innerHTML);
      numberCells[i].style.color = getTileTextColor(numberCells[i].innerHTML);
    }
  }

  init();

});
