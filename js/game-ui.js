(function() {

  var board, moveHandler;
  var currentPlayer = false;
  var enPassant = false;
  var promotion = false;
  var castling = false;
  var castlingTower = '';
  var message = '';
  var whiteImage = 'img/chesspieces/wikipedia/wP.png';
  var blackImage = 'img/chesspieces/wikipedia/bP.png';
  var kingInCheck = false;

  const SHORTCASTLING = 'f';
  const LONGCASLING = 'd';

  function init() {
    board = window.board = new ChessBoard('board', {draggable: true, onDrop: pieceDrop, moveSpeed: 'slow'});
  }

  function pieceDrop(source, target, piece, newPos, oldPos, orientation) {
    //if it isn't a valid move revert the chessboard to previous status
    if (moveHandler && !moveHandler(source, target)) {
      if(!kingInCheck) window.UI.showErrorMessage('Invalid move');
      return 'snapback';
    }

    if (enPassant) {
      window.UI.deleteImage(newPos[target[0] + source[1]]);
      delete newPos[target[0] + source[1]];
    }
    if (promotion) newPos[target] = (currentPlayer) ? BLACK + QUEEN : WHITE + QUEEN;
   
    var player = currentPlayer ? BLACK : WHITE;

    if(window.Utils.isInCheck(player, newPos, true)) {
      return 'snapback';
    }

    if(oldPos[target] != undefined) {
      window.UI.deleteImage(oldPos[target]);
    }
    //otherwise check if a piece needs to be removed
    currentPlayer = !currentPlayer;   //change active turn

    //wait for board update after new piece location
    setTimeout(function() {
      window.GameUI.setPieces(newPos);
      if (castling) {
        var newTowerPosition = castlingTower[0] == 'h' ? SHORTCASTLING : LONGCASLING;
        newTowerPosition += castlingTower[1];

        window.board.move(castlingTower + '-' + newTowerPosition);
      }
      var player = currentPlayer ? BLACK : WHITE;
      if(window.Utils.isInCheck(player, newPos, false)) {
        if(window.Utils.checkMateValidation(player, newPos)) {
          window.UI.checkMateMessage(player);
        };
      };
    }, 10);
      
    var message = currentPlayer ? 'black' : 'white';
    console.log('Toca turno: ' + message);
    var image = currentPlayer ? blackImage : whiteImage;
    window.UI.setImage(image);
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
    setCheckFlag: function(status) {
      kingInCheck = status;
    },
    resetFlags: function() {
      enPassant = false;
      promotion = false;
      castling = false;
      kingInCheck = false;
    },
    getCurrentTurn: function() {
      return currentPlayer ? 'b' : 'w';
    }
  }
}());