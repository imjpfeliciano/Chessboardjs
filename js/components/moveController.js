var undoStack = [];
var redoQueue = [];
(function() {
    function undoMove() {
        if(!undoStack.length) {
            window.UI.showErrorMessage('There are no available moves for undo action');
        } else {
            var previousMove = undoStack.pop();
            redoQueue.unshift(previousMove);
            window.GameUI.setPieces(previousMove.previous);
            window.GameUI.setCurrentPlayer(previousMove.player);
        }
    }    

    function redoMove() {
        if(!redoQueue.length) {
            window.UI.showErrorMessage('There are no available moves for redo action');
        } else {
            var previousMove = redoQueue.shift();
            undoStack.push(previousMove);
            window.GameUI.setPieces(previousMove.current);
            window.GameUI.setCurrentPlayer(previousMove.player);
        }
    }

    window.MOVES = {
        undo: undoMove,
        redo: redoMove
    }
}());
