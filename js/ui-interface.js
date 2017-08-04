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

    window.UI = {
        setImage: setImage,
        deleteImage: removePiece,
        showErrorMessage: showError
    }
}());
