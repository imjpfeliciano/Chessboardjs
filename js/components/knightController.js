(function() {
    /**
     * @param  {char} currentPlayer
     * @param  {string} source
     * @param  {string} target
     */
    function validateKnightMove(currentPlayer, source, target, currentMove, position, currentTurn) {
        //check if is turn of the selected piece color
        if(currentTurn != currentPlayer) return false;

        if( ((
            Math.abs(currentMove.rowDistance) == 1 && Math.abs(currentMove.colDistance) == 2 
            || (Math.abs(currentMove.rowDistance) == 2 && Math.abs(currentMove.colDistance) == 1)
            )
            && (position[target] == undefined || position[target][0] != currentPlayer) )) {
            return true;
        }

        return false;
    }

    window.KNIGHT = {
        checkMove: validateKnightMove
    }
}());
