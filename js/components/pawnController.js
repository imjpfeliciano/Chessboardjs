(function() {
    /**
     * @param  {object} board
     * @param  {object} currentMove
     * @param  {char} currentPlayer
     */
    function validatePromotion(board, moveInformation, currentPlayer) {
        //if it is a black piece, then i need to check for first row, otherwise check for the eigth row
        return ((currentPlayer == BLACK && moveInformation.tarRow == MINROW) || (currentPlayer == WHITE && moveInformation.tarRow == MAXROW));
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
        return (board[moveInformation.targetColor + moveInformation.tarRow] == undefined
                && board[moveInformation.targetColor + moveInformation.srcRow] != undefined
                && board[moveInformation.targetColor + moveInformation.srcRow][0] != currentPlayer 
                && board[moveInformation.targetColor + moveInformation.srcRow][1] == PAWN
                && players[opposite].pawns[moveInformation.tarCol] == MINCOL);
    }
    
    /**
     * @param  {char} currentPlayer
     * @param  {string} source
     * @param  {string} target
     */
    function validatePawnMove(currentPlayer, source, target, currentMove, position, currentTurn) {
        if(Math.abs(currentMove.colDistance) > 1) return false;
        if(currentTurn != currentPlayer) return false;

        //first move of each pawn
        if(( (currentMove.srcRow == 2 && currentPlayer == WHITE && currentMove.rowDistance == 2) 
            || (currentMove.srcRow == 7 && currentPlayer == BLACK && currentMove.rowDistance == -2)) 
            && Math.abs(currentMove.rowDistance) <=2 && currentMove.colDistance == 0)  {
            
            players[currentPlayer].pawns[currentMove.srcCol]++;
            return true;
        } 

        if(Math.abs(currentMove.rowDistance) == 1) {
            //check if the target position is candidate to promotion
            window.GameUI.setPromotionFlag(validatePromotion(position, currentMove, currentPlayer));
            
            //if it is only a step forward
            if(currentMove.colDistance == 0) {
                return (((currentMove.rowDistance == -1 && currentPlayer == BLACK) || (currentMove.rowDistance == 1 && currentPlayer == WHITE)) 
                        && position[target] == undefined);
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
                    return (((currentMove.rowDistance == -1 && currentPlayer == BLACK) || (currentMove.rowDistance == 1 && currentPlayer == WHITE)) 
                            && position[target][0] != currentPlayer);
                }
            }
        } 
    
        return false;
    }

    window.PAWN = {
        checkPromotion: validatePromotion,
        checkEnPassant: validateEnPassantMove,
        checkMove: validatePawnMove
    }
}());
