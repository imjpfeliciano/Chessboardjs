(function() {
    //The queen uses rookMoves for rows and columns and bishopMoves for diagonals,
    //so if any of these moves are valid, the queen move also is valid
    function validateQueenMove(currentPlayer, source, target, currentMove, position, currentTurn) {
        return window.ROOK.checkMove(currentPlayer, source, target, currentMove, position, currentTurn) 
            || window.BISHOP.checkMove(currentPlayer, source, target, currentMove, position, currentTurn) ;
    }

    window.QUEEN = {
        checkMove: validateQueenMove
    }
}());
