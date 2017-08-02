const WHITE = 'w';
const BLACK = 'b';

const PAWN = 'P';
const ROOK = 'R';
const BISHOP = 'B';
const KNIGHT = 'N';
const QUEEN = 'Q';
const KING = 'K';

var boardPosition = {
    "a8":"bR",
    "b8":"bN",
    //"c8":"bB",
    //"d8":"bQ",
    //"e8":"bK",
    //"f8":"bB",
    "g8":"bN",
    "h8":"bR",
    "a7":"bP",
    "b7":"bP",
    "c7":"bP",
    "d7":"bP",
    "e7":"bP",
    "f7":"bP",
    "g7":"bP",
    "h7":"bP",
    "a2":"wP",
    "b2":"wP",
    "c2":"wP",
    "d2":"wP",
    "e2":"wP",
    "f2":"wP",
    "g2":"wP",
    "h2":"wP",
    "a1":"wR",
    "b1":"wN",
    //"c1":"wB",
    //"d1":"wQ",
    //"e1":"wK",
    //"f1":"wB",
    "g1":"wN",
    "h1":"wR"
};

(function() {
    /**
     * Returns the int representation of a column letter
     * @param  {char} columnLetter
     * @returns {int} 
     */
    function columnNumber(columnLetter) {
        return columnLetter.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    }

    /**
     * @param {int} columnNumber 
     * @returns {char}
     */
    function columnLetter(columnNumber) {
        return String.fromCharCode(columnNumber + 96);
    }

    /**
     * Returns distance between rows and columns from source point to target point in the chessboard
     * @param  {String} source 
     * @param  {String} target
     * @returns {Object} 
     */
    function distance(source, target) {
        var sourceRowNumber = parseInt(source[1]);
        var sourceColNumber = columnNumber(source[0]);

        var targetRowNumber = parseInt(target[1]);
        var targetColNumber = columnNumber(target[0]);

        var rowDistance = targetRowNumber - sourceRowNumber;
        var columnDistance = targetColNumber - sourceColNumber;

        var targetColor = target[0];
        var sourceColor = source[0];

        return {
            srcRow: sourceRowNumber,
            srcCol: sourceColNumber,
            tarRow: targetRowNumber,
            tarCol: targetColNumber,
            targetColor: targetColor,
            sourceColor: sourceColor,
            rowDistance: rowDistance,
            colDistance: columnDistance
        }
    }

    window.Utils = {
        getInformation: distance,
        getColumnLetter: columnLetter,
        getDefaultPosition: function() {
            return boardPosition;
        }
    }
}());
