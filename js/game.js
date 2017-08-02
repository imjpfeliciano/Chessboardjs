

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

    function isInCheck(player, position) {
        return false;
    }

    /**
     * @param  {object} board
     * @param  {object} currentMove
     * @param  {char} currentPlayer
     */
    function validatePromotion(board, moveInformation, currentPlayer) {
        //if it is a black piece, then i need to check for first row, otherwise check for the eigth row
        return (currentPlayer == BLACK && moveInformation.tarRow == 1) || (currentPlayer == WHITE && moveInformation.tarRow == 8);
    }

    /**
     * @param  {object} board
     * @param  {object} currentMove
     * @param  {char} currentPlayer
     */
    function validateEnPassantMove(board, moveInformation, currentPlayer) {
        var opposite = (currentPlayer == BLACK) ? WHITE : BLACK;

        //if the target position is empty and the cell between source and target is a piece of the opposite color
        //and it is a PAWN piece that was moved two cells for first time
        return board[moveInformation.targetColor + moveInformation.tarRow] == undefined
                && board[moveInformation.targetColor + moveInformation.srcRow] != undefined
                && board[moveInformation.targetColor + moveInformation.srcRow][0] != currentPlayer 
                && board[moveInformation.targetColor + moveInformation.srcRow][1] == PAWN
                && players[opposite].pawns[moveInformation.tarCol] == 1;
    }
    
    /**
     * @param  {char} currentPlayer
     * @param  {string} source
     * @param  {string} target
     */
    function validatePawnMove(currentPlayer, source, target) {
        if(target == 'offboard') return false;
        var currentMove = window.Utils.getInformation(source, target);
        var position = window.GameUI.getPieces();
        var currentTurn = window.GameUI.getCurrentTurn();

        if(Math.abs(currentMove.colDistance) > 1) return false;
        if(currentTurn != currentPlayer) return false;

        //first move of each pawn
        if(( (currentMove.srcRow == 2 && currentPlayer == WHITE) || (currentMove.srcRow == 7 && currentPlayer == BLACK)) 
            && Math.abs(currentMove.rowDistance) <=2 && currentMove.colDistance == 0 && !isInCheck())  {
            
            players[currentPlayer].pawns[currentMove.srcCol]++;
            return true;
        } 

        if(Math.abs(currentMove.rowDistance) == 1) {
            //check if the target position is candidate to promotion
            window.GameUI.setPromotionFlag(validatePromotion(position, currentMove, currentPlayer));
            
            //if it is only a step forward
            if(currentMove.colDistance == 0) {
                return ((currentMove.rowDistance == -1 && currentPlayer == BLACK) || (currentMove.rowDistance == 1 && currentPlayer == WHITE)) 
                        && position[target] == undefined;
            } else {
                //if it is a step in diagonal form and the target position is empty,
                //then it needs to check if is a valid en passant move
                if(position[target] == undefined) {
                    //En passant goes here
                    if(validateEnPassantMove(position, currentMove, currentPlayer)) {
                        window.GameUI.setEnPassantFlag(true);
                        return true;                    
                    }
                } else {
                    //win against piece of other color
                    return ((currentMove.rowDistance == -1 && currentPlayer == BLACK) || (currentMove.rowDistance == 1 && currentPlayer == WHITE)) 
                            && position[target][0] != currentPlayer;
                }
            }
        } 
    
        return false;
    }

    /**
     * @param {char} currentPlayer 
     * @param {string} source 
     * @param {string} target 
     */
    function validateFirstRookMove(currentPlayer, source, target) {
        if(target == 'offboard') return false;
        var currentMove = window.Utils.getInformation(source, target);
        var position = window.GameUI.getPieces();
        var currentTurn = window.GameUI.getCurrentTurn();

        //if it is the first time a rook piece is moved, then give a sign in the players object
        if( ((currentMove.srcCol == 1 || currentMove.srcCol == 8) && currentMove.srcRow == 1 && currentPlayer == WHITE && players[WHITE].rooks[currentMove.srcCol] == 0) 
         || ((currentMove.srcCol == 1 || currentMove.srcCol == 8) && currentMove.srcRow == 8 && currentPlayer == BLACK && players[BLACK].rooks[currentMove.srcCol] == 0) ) {
             players[currentPlayer].rooks[currentMove.srcCol] = 1;
         }
    }

    /**
     * @param {char} currentPlayer 
     * @param {string} source 
     * @param {string} target 
     */
    function validateRookMove(currentPlayer, source, target) {
        if(target == 'offboard') return false;
        var currentMove = window.Utils.getInformation(source, target);
        var position = window.GameUI.getPieces();
        var currentTurn = window.GameUI.getCurrentTurn();

        //check if is turn of the selected piece color
        if((currentTurn != currentPlayer) || (currentMove.colDistance && currentMove.rowDistance)) return false;

        //check move between cols
        if(currentMove.colDistance) {
            var ini = Math.min(currentMove.srcCol, currentMove.tarCol);
            var fin = Math.max(currentMove.srcCol, currentMove.tarCol);
            for(var i=ini; i<=fin; i++) {
                var columnLetter = window.Utils.getColumnLetter(i);
                var currentPosition = columnLetter + currentMove.srcRow;

                if(currentPosition == source || position[currentPosition] == undefined && i == fin -1 || (currentPosition == target 
                    && position[currentPosition] != undefined && position[currentPosition][0] != currentPlayer) ) continue;
                
                if((position[currentPosition] != undefined && currentPosition != target ) 
                    || (position[currentPosition] != undefined && position[currentPosition][0] == currentPlayer)) return false;
            }
        } else {
            //check move between rows
            var columnLetter = window.Utils.getColumnLetter(currentMove.srcCol);
            var ini = Math.min(currentMove.srcRow, currentMove.tarRow);
            var fin = Math.max(currentMove.srcRow, currentMove.tarRow);

            for(var i=ini; i<=fin; i++) {
                var currentPosition = columnLetter + i;
                if(currentPosition == source || position[currentPosition] == undefined && i == fin -1 || (currentPosition == target 
                    && position[currentPosition] != undefined && position[currentPosition][0] != currentPlayer) ) continue;

                if((position[currentPosition] != undefined && currentPosition != target ) 
                    || (position[currentPosition] != undefined && position[currentPosition][0] == currentPlayer)) return false;
            }
        }

        return true;
    }
    
    /**
     * @param  {char} currentPlayer
     * @param  {string} source
     * @param  {string} target
     */
    function validateKnightMove(currentPlayer, source, target) {
        if(target == 'offboard') return false;
        var currentMove = window.Utils.getInformation(source, target);
        var position = window.GameUI.getPieces();
        var currentTurn = window.GameUI.getCurrentTurn();

        //check if is turn of the selected piece color
        if(currentTurn != currentPlayer) return false;

        if( (
            Math.abs(currentMove.rowDistance) == 1 && Math.abs(currentMove.colDistance) == 2 
            || (Math.abs(currentMove.rowDistance) == 2 && Math.abs(currentMove.colDistance) == 1)
            )
            && (position[target] == undefined || position[target][0] != currentPlayer) ) {
            return true;
        }

        return false;
    }

    function getBishopMoveOrientation(rowDistance, colDistance) {
        if(rowDistance > 0 && colDistance < 0) return {x: 1, y: -1};
        if(rowDistance > 0 && colDistance > 0) return {x: 1, y: 1};
        if(rowDistance < 0 && colDistance < 0) return {x: -1, y: -1};
        if(rowDistance < 0 && colDistance > 0) return {x: -1, y: 1};
    }

    function validateBishopMove(currentPlayer, source, target) {
        if(target == 'offboard') return false;
        var currentMove = window.Utils.getInformation(source, target);
        var position = window.GameUI.getPieces();
        var currentTurn = window.GameUI.getCurrentTurn();

        //check if is turn of the selected piece color
        if(currentTurn != currentPlayer) return false;

        if(Math.abs(currentMove.rowDistance) != Math.abs(currentMove.colDistance)) return false;

        var orientation = getBishopMoveOrientation(currentMove.rowDistance, currentMove.colDistance);

        var currentColNumber = currentMove.srcCol + orientation.y;
        var currentRowNumber = currentMove.srcRow + orientation.x;
        var currentPosition = window.Utils.getColumnLetter(currentColNumber) + (currentRowNumber);

        //it started to move in diagonals looking for the target position
        //if it is a piece between source and target it must return invalid move
        while(currentPosition != target) {      
            if(position[currentPosition] != undefined) return false;  

            currentColNumber += orientation.y;
            currentRowNumber += orientation.x;
            currentPosition = window.Utils.getColumnLetter(currentColNumber) + (currentRowNumber);       
        }

        //if the target position is empty or has a piece of different color as the current player
        return (position[currentPosition] == undefined || (position[currentPosition] != undefined && position[currentPosition][0] != currentPlayer));
    }

    //The queen uses rookMoves for rows and columns and bishopMoves for diagonals,
    //so if any of these moves are valid, the queen move also is valid
    function validateQueenMove(currentPlayer, source, target) {
        return validateRookMove(currentPlayer, source, target) || validateBishopMove(currentPlayer, source, target) ;
    }

    /*
    castling will be check here
    */
    function validateKingMove(currentPlayer, source, target) {
        return true;  
    }

    //case function to validate each piece separately
    function checkValidMove(player, piece, source, target) {
        switch(piece) {
            case 'P': return validatePawnMove(player, source, target);
            case 'R': 
                if(validateRookMove(player, source, target)) {
                    validateFirstRookMove(player, source, target);
                    return true;
                } else {
                    return false;
                }
            case 'N': return validateKnightMove(player, source, target);
            case 'B': return validateBishopMove(player, source, target);
            case 'Q': return validateQueenMove(player, source, target);
            case 'K': return validateKingMove(player, source, target);
        }
    }


    function pieceMoveHandler(from, to) {
        if(from == to) return false;
        window.GameUI.resetFlags(false);

        position = window.board.position();

        var currentPiece = position[from];
        var player = currentPiece[0];
        var piece = currentPiece[1];

        return checkValidMove(player, piece, from, to);
    }

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

    var position = window.Utils.getDefaultPosition();
    var useAnimation = true;
    
    window.GameUI.setPieces(position, useAnimation);
    window.GameUI.setMoveHandler(pieceMoveHandler);
}

document.addEventListener('DOMContentLoaded', init);