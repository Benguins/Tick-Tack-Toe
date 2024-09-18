const startButton = document.querySelector('.js-start');
startButton.addEventListener('click', () => {
  Game.start();
});

const restartButton = document.querySelector('.js-reset');
restartButton.addEventListener('click', () => {
  Game.restart();
})

const Gameboard = (() => { // Module for when we want to do it only once
  let gameBoard = ["", "", "", "", "", "", "", "", ""];

  function render(){
    let boardHTML = '';
    gameBoard.forEach((square, index) => {
      boardHTML += `<div class="square" id="square-${index}">${square}</div>`
    });
    document.querySelector('.js-gameboard').innerHTML = boardHTML;
    const squares = document.querySelectorAll('.square');
    squares.forEach((square) => {
      square.addEventListener('click', Game.handleClick);
    });
  };

  function update(index, value){
    gameBoard[index] = value;
    render();
  }

  function getGameBoard(){
    return gameBoard;
  }

  return {
    render,
    update,
    getGameBoard
  }

})(); // This () at the end is an IIFE  

function createPlayerFactory(name, mark){ 
  return {
    name,
    mark
  }
}

const Displayedinformation = (() => {
  function renderMessage(message){
    document.querySelector('.js-message').innerHTML = message;
  }

  return{
    renderMessage
  }

})();

const Game = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver;

  function start(){
    players = [
      createPlayerFactory(document.querySelector('.js-player-one-input').value, 'X'),
      createPlayerFactory(document.querySelector('.js-player-two-input').value, 'O')
    ];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.render();
  };
  

  function handleClick(event){
    if(gameOver){
      return;
    }
    let index = parseInt(event.target.id.split("-")[1]);
    if(Gameboard.getGameBoard()[index] !== ""){
      return;
    }
    Gameboard.update(index, players[currentPlayerIndex].mark);

    if(checkForWin(Gameboard.getGameBoard(), players[currentPlayerIndex].mark)){
      gameOver = true;
      Displayedinformation.renderMessage(`${players[currentPlayerIndex].name} Won!`)
    } else if(checkForTie(Gameboard.getGameBoard(players[currentPlayerIndex].name))){
      gameOver = true;
      Displayedinformation.renderMessage("It's a tie");
    }
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  }

  function checkForWin(board){
    const winningCombination = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for(let i = 0; i < winningCombination.length; i++){
      const [a, b, c] = winningCombination[i];
      if(board[a] && board[a] === board[b] && board[a] === board[c]){
        return true;
      }
    }
    return false;
  }

  function checkForTie(board){
    return board.every(cell => cell !== "");
  }

  function restart(){
    for(i = 0; i < 9; i++){
      Gameboard.update(i, "");
    };
    Displayedinformation.renderMessage('');
    gameOver = false;
    Gameboard.render();
  }

  return{
    start,
    handleClick,
    restart
  }
})();




