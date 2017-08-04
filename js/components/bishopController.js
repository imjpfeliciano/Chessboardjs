(function() {
    /**
     * Check the quadrant in which the bishop is moving
     * @param {int} rowDistance 
     * @param {int} colDistance 
     * @returns {object}
     */
    function getBishopMoveOrientation(rowDistance, colDistance) {
        if(rowDistance > 0 && colDistance < 0) return {x: 1, y: -1};
        if(rowDistance > 0 && colDistance > 0) return {x: 1, y: 1};
        if(rowDistance < 0 && colDistance < 0) return {x: -1, y: -1};
        if(rowDistance < 0 && colDistance > 0) return {x: -1, y: 1};
    }

    /**
     * @param {char} currentPlayer 
     * @param {string} source 
     * @param {string} target 
     */
    function validateBishopMove(currentPlayer, source, target, currentMove, position, currentTurn) {
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

    window.BISHOP = {
        checkMove: validateBishopMove
    }
}());
