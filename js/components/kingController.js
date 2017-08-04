(function() {
    /**
     * @param {object} board 
     * @param {object} moveInformation 
     * @param {char} currentPlayer 
     */
    function validateCastlingMove(board, moveInformation, currentPlayer) {
        if(players[currentPlayer].king == 1) return false;
        
        var currentRowNumber = moveInformation.srcRow;
        var towerPosition = '';

        if(moveInformation.tarCol == 7) {
            if(players[currentPlayer].rooks[8] != 0) return false;
            towerPosition = 'h' + currentRowNumber;
            for(var i=6; i <=7; i++) {
                var columnLetter = window.Utils.getColumnLetter(i);
                var currentPosition = columnLetter + currentRowNumber;

                if(board[currentPosition] != undefined) return false;
            }
        } else if (moveInformation.tarCol == 3){
            if(players[currentPlayer].rooks[1] != 0) return false;
            towerPosition = 'a' + currentRowNumber;
            for(var i=2; i <=4; i++) {
                var columnLetter = window.Utils.getColumnLetter(i);
                var currentPosition = columnLetter + currentRowNumber;
                
                if(board[currentPosition] != undefined) return false;
            }
        }

        window.GameUI.setCastlingFlag(true, towerPosition);
        return true; 
    }

    /**
     * @param {char} currentPlayer 
     * @param {string} source 
     * @param {string} target 
     */
    function validateKingMove(currentPlayer, source, target, currentMove, position, currentTurn) {
        //check if is turn of the selected piece color
        if(currentTurn != currentPlayer) return false;
        if(Math.abs(currentMove.rowDistance) > 1) return false;
        
        //validate castrling here
        if( Math.abs(currentMove.colDistance) == 2 && ((currentMove.tarRow == MINROW && currentPlayer == WHITE) 
            || (currentMove.tarRow == MAXROW && currentPlayer == BLACK)) ) {
            return validateCastlingMove(position, currentMove, currentPlayer);
        } else {
            if( (currentMove.colDistance >= -1 && currentMove.colDistance <= 1) 
                && (currentMove.rowDistance >= -1 && currentMove.rowDistance <= 1)
                && (position[target] == undefined || position[target][0] != currentPlayer)
            ) {
                players[currentPlayer].king = 1;
                console.log(players);
                return true;
            } 
        }
        return false;  
    }
    window.KING = {
        checkMove: validateKingMove
    }
}());
