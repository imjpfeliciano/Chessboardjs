(function() {
    //if we're checking current player then show check message, otherwise it is an invalid move
    function checkMessage(opposite) {
        if(opposite) {
            window.UI.showErrorMessage('Invalid Move, your King is in check');
            window.GameUI.setCheckFlag(true);
        } else {
            window.UI.showCheckMessage();
        }
    }    

    //pawns and knights have similar movements, only check for static positions
    function checkPositions(piece, board, kingPosition, moves, opposite) {
        for(var i=0; i < moves.length; i++) {
            var currentRow = kingPosition.x + moves[i].x;
            var currentCol = kingPosition.y + moves[i].y;
            if(currentRow >= MINROW && currentRow <= MAXROW
                && currentCol >= MINCOL && currentCol <= MAXCOL
                && board[window.Utils.getColumnLetter(currentCol) + currentRow] != undefined
                && board[window.Utils.getColumnLetter(currentCol) + currentRow] == piece      
            ) {
                //checkMessage(opposite);
                return true;
            }
        }

        return false;
    }

    //pawns have only two possibilities for check
    function checkByPawn(player, board, kingPosition, opposite) {
        if(player == WHITE) {
            var piece = BLACK + PAWN;
            var validMoves = [
                {x: 1, y:1},
                {x: 1, y:-1}
            ];
        } else {
            var piece = WHITE + PAWN;
            var validMoves = [
                {x: -1, y:1},
                {x: -1, y:-1}
            ];
        }

        return checkPositions(piece, board, kingPosition, validMoves, opposite);
    }

    function checkAllDirections(pieces, board, kingPosition, moves, opposite) {
        for(var i=0; i < moves.length; i++) {
            var currentRow = kingPosition.x + moves[i].x;
            var currentCol = kingPosition.y + moves[i].y;
            while(currentRow >= MINROW && currentRow <= MAXROW && currentCol >= MINCOL && currentCol <= MAXCOL) {
                
                var currentPosition = window.Utils.getColumnLetter(currentCol) + currentRow;
                
                if(board[currentPosition] != undefined 
                    && (board[currentPosition] == pieces[0] || board[currentPosition] == pieces[1])
                ) {
                    //checkMessage(opposite);
                    return true;
                }

                if(board[currentPosition] != undefined) break;

                currentRow = currentRow + moves[i].x;
                currentCol = currentCol + moves[i].y;
            }
        }
        return false;
    }

    function checkByRook(player, board, kingPosition, opposite) {
        var rookPiece = (player == WHITE) ? BLACK + ROOK : WHITE + ROOK;
        var queenPiece = (player == WHITE) ? BLACK + QUEEN : WHITE + QUEEN;

        var pieces = [rookPiece, queenPiece];

        var validMoves = [
            {x: 0, y:-1},
            {x: 0, y:1},
            {x: 1, y:0},
            {x: -1, y:0}
        ];

        return checkAllDirections(pieces, board, kingPosition, validMoves, opposite);
    }

    //kight have eight possibles cells for check
    function checkByKnight(player, board, kingPosition, opposite) {
        var piece = (player == WHITE) ? BLACK + KNIGHT : WHITE + KNIGHT;
        var validMoves = [
            {x: 1, y:-2},
            {x: 2, y:-1},
            {x: 2, y:1},
            {x: 1, y:2},
            {x: -1, y:2},
            {x: -2, y:1},
            {x: -2, y:-1},
            {x: -1, y:-2}
        ];

        return checkPositions(piece, board, kingPosition, validMoves, opposite);
    }


    function checkByBishop(player, board, kingPosition, opposite) {
        var bishopPiece = (player == WHITE) ? BLACK + BISHOP : WHITE + BISHOP;
        var queenPiece = (player == WHITE) ? BLACK + QUEEN : WHITE + QUEEN;
        
        var pieces = [bishopPiece, queenPiece];
        
        var validMoves = [
            {x: -1, y:1},
            {x: 1, y:1},
            {x: -1, y:-1},
            {x: 1, y:-1}
        ];

        return checkAllDirections(pieces, board, kingPosition, validMoves, opposite);
    }

    function isInCheck(player, board, opposite) {
        var kingPiece = player + KING;
        for(key in board) {
            if(board[key] == kingPiece) {
                var kingPosition = {
                    x: parseInt(key[1]),
                    y: window.Utils.getColumnNumber(key[0])
                };
                break;
            }
        }

        return checkByPawn(player, board, kingPosition, opposite) || checkByRook(player, board, kingPosition, opposite)
                || checkByKnight(player, board, kingPosition, opposite) || checkByBishop(player,  board, kingPosition, opposite);
    }

    function movePiece(player, currentBoard, piece) {
        var currentPiece = piece.value[1];
        for(var i=MINROW; i <= MAXROW; i++) {
            for(var j=MINCOL; j <= MAXCOL; j++) {
                var currentPosition = window.Utils.getColumnLetter(j) + i;
                var board = JSON.stringify(currentBoard);
                    board = JSON.parse(board);

                if(window.GameUI.validMove(player, currentPiece, piece.position, currentPosition, board)) {
                    delete board[piece.position];
                    board[currentPosition] = piece.value;
                    //var oppositePlayer = (player == WHITE) ? BLACK : WHITE;
                    if(isInCheck(player, board, true)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    function checkMateValidation(currentPlayer, board) {
        //prevent argument by reference
        var newBoard = JSON.stringify(board);
        newBoard = JSON.parse(newBoard);

        var pieces = [];
        var oppositePlayer = (currentPlayer == WHITE) ? BLACK : WHITE;
        //getting all pieces from the current player
        for(key in board) {
            if(newBoard[key][0] == oppositePlayer) {
                pieces.push({position: key, value: newBoard[key]});
            }
        }

        for(var i=0; i < pieces.length; i++) {
            var currentBoard = JSON.stringify(board);
                currentBoard = JSON.parse(currentBoard);

            var canMove = movePiece(currentPlayer,currentBoard, pieces[i]);

            if(canMove) {
                return false;
            }
        }

        return true;
    }

    window.CHECK = {
        kingIsCheck: isInCheck,
        isCheckMate: checkMateValidation
    }
}());
