(function() {

  var board, moveHandler;
  var currentPlayer = false;
  var enPassant = false;
  var promotion = false;
  var castling = false;
  var castlingTower = '';

  function init() {
    board = window.board = new ChessBoard('board', {draggable: true, onDrop: pieceDrop, moveSpeed: 'slow'});
  }

  function pieceDrop(source, target, piece, newPos, oldPos, orientation) {
    //if it isn't a valid move revert the chessboard to previous status
    if (moveHandler && !moveHandler(source, target)) return 'snapback';

    if (enPassant) delete newPos[target[0] + source[1]];
    if (promotion) newPos[target] = (currentPlayer) ? BLACK + QUEEN : WHITE + QUEEN;
   
    //otherwise check if a piece needs to be removed
    currentPlayer = !currentPlayer;   //change active turn

    //wait for board update after new piece location
    setTimeout(function() {
      window.GameUI.setPieces(newPos);
      if (castling) {
        var newTowerPosition = castlingTower[0] == 'h' ? 'f' : 'd';
        newTowerPosition += castlingTower[1];

        window.board.move(castlingTower + '-' + newTowerPosition);
      }
    }, 10);
      
    var message = currentPlayer ? 'black' : 'white';
    console.log('Toca turno: ' + message);
  }

  document.addEventListener('DOMContentLoaded', init);

  window.GameUI = {
    getPieces: function() {
      return board.position();
    }, 
    setPieces: function (pieces) {
      board.clear();
      board.position(pieces)
    },
    setMoveHandler: function(handler) {
     moveHandler = handler;
    },
    setEnPassantFlag: function(status) {
      enPassant = status;
    },
    setPromotionFlag: function(status) {
      promotion = status;
    },
    setCastlingFlag: function(status, positionTower) {
      castling = status;
      castlingTower = positionTower;
    },
    resetFlags: function() {
      enPassant = false;
      promotion = false;
      castling = false;
    },
    getCurrentTurn: function() {
      return currentPlayer ? 'b' : 'w';
    }
  }
}());