//Game moves for specific pieces
var players = {
    w: { 
        pawns: [0,0,0,0,0,0,0,0],
        rooks: {1: 0, 8: 0},
        king: 0
    },
    b: {
        pawns: [0,0,0,0,0,0,0,0],
        rooks: {1: 0, 8: 0},
        king: 0
    }
};

function init() {
// 1.- Set a move handler, a move handler is a function which is going to be invoked for every movement
//     made by a user, and should return either true or false if the movement was completed sucesfully,
//     the moveHandler will be invoked with two parameters, from and to which represents the movement
//     made by the user the move handler is set with window.GameUI.setMoveHandler(yourMoveHandler);

// 2.- Call window.GameUI.setPieces everytime the board needs to be drawed, that's it at the very begining
//     and once every time the user made a valid movement. It's parameter should contain an object representing
//     every piece on the board, every object property represents a board square using common chess notation.
//     i.e a1 is the bottom most left corner of the board. The value of the key represents they piece content
//     of the square, the piece is identified by two characters, the first one represents the color,
//     it needs to be either w for white or b for black. The second one represents the piece type
//     Valid piece types:
//       P: Pawn
//       R: Rook
//       B: Bishop
//       N: kNights
//       Q: Queen
//       K: King
//     i.e a1: "bN" would place a black knight at the bottom left corner of the board.

    //case function to validate each piece separately
    function checkValidMove(player, piece, source, target, position) {
        if(source == target || target == 'offboard') return false;
        console.log(player);
        console.log(piece);
        console.log(source);
        console.log(target);
        var currentMove = window.Utils.getInformation(source, target);
        var position = position || window.GameUI.getPieces();
        var currentTurn = window.GameUI.getCurrentTurn();

        console.log(currentMove);
        switch(piece) {
            case 'P': return window.PAWN.checkMove(player, source, target, currentMove, position, currentTurn);
            case 'R': 
                if(window.ROOK.checkMove(player, source, target, currentMove, position, currentTurn)) {
                    window.ROOK.checkFirstMove(player, source, target, currentMove);
                    return true;
                } else {
                    return false;
                }
            case 'N': return window.KNIGHT.checkMove(player, source, target, currentMove, position, currentTurn);
            case 'B': return window.BISHOP.checkMove(player, source, target, currentMove, position, currentTurn);
            case 'Q': return window.QUEEN.checkMove(player, source, target, currentMove, position, currentTurn);
            case 'K': return window.KING.checkMove(player, source, target, currentMove, position, currentTurn);
        }
    }


    function pieceMoveHandler(from, to) {
        if(from == to || to == 'offboard') return false;
        window.GameUI.resetFlags(false);

        position = window.GameUI.getPieces();

        var currentPiece = position[from];
        var player = currentPiece[0];
        var piece = currentPiece[1];

        return checkValidMove(player, piece, from, to);
    }

    var position = window.Utils.getDefaultPosition();
    var useAnimation = true;
    
    window.GameUI.setPieces(position, useAnimation);
    window.GameUI.setMoveHandler(pieceMoveHandler);

    window.GameUI.validMove = checkValidMove;
}

document.addEventListener('DOMContentLoaded', init);