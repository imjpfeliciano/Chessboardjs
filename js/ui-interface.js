(function() {
    function setImage(image) {
        $('#currentPlayerImage').attr('src', image);
    }

    function removePiece(data) {
        var color = data[0];
        var piece = data[1];

        var container = (color == WHITE) ? '#blackTrash' : '#whiteTrash';
        $(container).append('<img src="img/chesspieces/wikipedia/' + color + piece + '.png" style="height: 49px; width: 49px;">');
    }

    function showError(message) {
        toastr.error(message);
    }

    function showCheckMessage() {
        toastr.info('Check');
    }

    function showCheckMate(player) {
        var message = (player == WHITE) ? 'Player 1' : 'Player 2';
        toastr.success('Checkmate!!! ' + message + ' wins!');

        $('#currentPlayer').html('<h1>' + message + ' wins!</h1>');
        window.board.destroy();
    }

    window.UI = {
        setImage: setImage,
        deleteImage: removePiece,
        showErrorMessage: showError,
        showCheckMessage: showCheckMessage,
        checkMateMessage: showCheckMate
    }
}());
