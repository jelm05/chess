
document.addEventListener("DOMContentLoaded", function () {
    const START_POS =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";


    // board initialized later; game/Chess() is chess.js engine
    let board;
    let game = new Chess();
    let gameRunning = false;


    // Really this calculation is done by chess.js; we're passing the game object
    let calculateMoves = function (game) {
      // ugly_moves() from chess.js; moves() is in 0x88 format;
      let potentialMoves = game.ugly_moves();

      // This is returning a random move of possible moves
      return potentialMoves[Math.floor(Math.random() * potentialMoves.length)];
    };


    let getMove = function (game) {
      if (game.game_over()) {
        alert("Game Over");
        game.reset();
      }

      let move = calculateMoves(game);
      return move;
    };


    let makeMove = function () {
      let move = getMove(game);
      game.ugly_move(move);

      // .fen() returns the FEN string for the current position
      board.position(game.fen());
      if (game.game_over()) {
        alert("Game over");
        game.reset();
      }
    };


    // function named determined by chessboard.js -- overwriting
    let onMouseoverSquare = function (square, piece) {
      // Gather available moves via the square we're hovering over
      let moves = game.moves({
        square: square,
        verbose: true,
      });

      // console.log("moves", moves)

      // If no moves available, do nothing
      if (moves.length === 0) return;

      // This highlights the square we're currently hovering over
      highlightAvailableMoves(square);

      // This highlights available moves
      for (var i = 0; i < moves.length; i++) {
        highlightAvailableMoves(moves[i].to);
      }
    };

    // function named determined by chessboard.js -- overwriting
    let onMouseoutSquare = function (square, piece) {
      removeHighlightedMoves();
    };

    let onDragStart = function (source, piece, position, orientation) {
      // chessboard.js returns -1 when a piece isn't valid
      // if we leave the piece search in it will prevent the user from playing black; because the engine will make the first move
      // piece search with passed regex is looking for either 'b' or 'w' --so white or black pieces,
      // we can use that to prevent the user from moving either or piece; -1 just means it returned false
      // if (game.in_checkmate() === true || game.in_draw() === true || piece.search(/^b/) !== -1) {
      //     return false;
      // }

      if (game.in_checkmate() === true || game.in_draw() === true) {
        return false;
      }
    };


    // function named determined by chessboard.js -- overwriting
    let onDrop = function (source, target) {
      var move = game.move({
        from: source,
        to: target,
        promotion: "q",
      });

      removeHighlightedMoves();

      // if the move wasn't allowed, send the piece back
      if (move === null) {
        return "snapback";
      }

      // AI opponent makes move after you make a move;
      window.setTimeout(makeMove, 250);
    };


    let highlightAvailableMoves = function (square) {
      if (gameRunning === false) return;

      let squareDiv = $("#board .square-" + square);

      let darkBackgroundColor = "#0a7b80";
      let lightBackgroundColor = "#12d7de";

      // dark square background color class determined by chessboard.js library
      if (squareDiv.hasClass("black-3c85d") === true) {
        squareDiv.css("background", darkBackgroundColor);
      } else {
        squareDiv.css("background", lightBackgroundColor);
      }
    };


    let removeHighlightedMoves = function () {
      $("#board .square-55d63").css("background", "");
    };


    // Render the board
    const config = {
      draggable: true,
      dropOffBoard: "snapback", // this is the default
      showErrors: "true",
      // position: 'start', --we're starting with clear board so user can select side
      // orientation: orientation, // set orientation to white/black
      onDrop: onDrop,
      onDragStart: onDragStart,
      onMouseoverSquare: onMouseoverSquare,
      onMouseoutSquare: onMouseoutSquare,
    };

    board = Chessboard("board", config);


    let $startButtons = $(".start-button");
    $startButtons.on("click", function (event) {
      game.reset();
      board.clear();

      let sideSelection = $(this).attr("id");

      if (sideSelection === "start-white") {
        gameRunning = true;
        config["position"] = START_POS;
        config["orientation"] = "white";
        board = Chessboard("board", config);
      } else {
        gameRunning = true;
        config["position"] = START_POS;
        config["orientation"] = "black";
        board = Chessboard("board", config);
        window.setTimeout(makeMove, 250);
      }
    });
  },
  false,
);
