(function() {
    /**
     * @param {char} currentPlayer 
     * @param {string} source 
     * @param {string} target 
     */
    function validateFirstRookMove(currentPlayer, source, target, currentMove) {
        //if it is the first time a rook piece is moved, then give a sign in the players object
        if( ((currentMove.srcCol == MINCOL || currentMove.srcCol == MAXCOL) && currentMove.srcRow == MINROW && currentPlayer == WHITE && players[WHITE].rooks[currentMove.srcCol] == 0) 
         || ((currentMove.srcCol == MINCOL || currentMove.srcCol == MAXCOL) && currentMove.srcRow == MAXROW && currentPlayer == BLACK && players[BLACK].rooks[currentMove.srcCol] == 0) ) {
             players[currentPlayer].rooks[currentMove.srcCol] = 1;
         }
    }

    /**
     * @param {char} currentPlayer 
     * @param {string} source 
     * @param {string} target 
     */
    function validateRookMove(currentPlayer, source, target, currentMove, position, currentTurn) {
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

    window.ROOK = {
        checkFirstMove: validateFirstRookMove,
        checkMove: validateRookMove
    }
}());
