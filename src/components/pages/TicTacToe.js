import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import "./TicTacToe.css";
import FancyButton from "../small/FancyButton";

/* 
Esta tarea consiste en hacer que el juego funcione, para lograr eso deben completar el componente 
TicTacToe y el custom hook `useTicTacToeGameState`, que como ven solamente define algunas variables.

Para completar esta tarea, es requisito que la FIRMA del hook no cambie.
La firma de una función consiste en los argumentos que recibe y el resultado que devuelve.
Es decir, este hook debe recibir el argumento initialPlayer y debe devolver un objeto con las siguientes propiedades:
{
  tiles: // un array de longitud 9 que representa el estado del tablero (es longitud 9 porque el tablero es 3x3)
  currentPlayer: // un string que representa el jugador actual ('X' o 'O')
  winner: // el ganador del partido, en caso que haya uno. si no existe, debe ser `null`
  gameEnded: // un booleano que representa si el juego terminó o no
  setTileTo: // una función que se ejecutará en cada click
  restart: // una función que vuelve a setear el estado original del juego
}

Verán que los diferentes componentes utilizados están completados y llevan sus propios propTypes
Esto les dará algunas pistas
*/

const Square = ({ value, onClick = () => {} }) => {
  return (
    <div onClick={onClick} className="square">
      {value}
    </div>
  );
};
Square.propTypes = {
  value: PropTypes.oneOf(["X", "O", ""]),
  onClick: PropTypes.func,
};

const WinnerCard = ({ show, winner, onRestart = () => {} }) => {
  return (
    <div className={cx("winner-card", { "winner-card--hidden": !show })}>
      <span className="winner-card-text">
        {winner ? `Player ${winner} has won the game!` : "It's a tie!"}
      </span>
      <FancyButton onClick={onRestart}>Play again?</FancyButton>
    </div>
  );
};

WinnerCard.propTypes = {
  // Esta propiedad decide si el componente se muestra o está oculto
  // También se podría mostrar el componente usando un if (&&), pero usamos esta prop para mostrar los estilos correctamente.
  show: PropTypes.bool.isRequired,
  winner: PropTypes.oneOf(["X", "O"]),
  onRestart: PropTypes.func,
};

const getWinner = (tiles) => {
  const solutions = [
    [tiles[0][0], tiles[0][1], tiles[0][2]],
    [tiles[1][0], tiles[1][1], tiles[1][2]],
    [tiles[2][0], tiles[2][1], tiles[2][2]],
    [tiles[0][0], tiles[1][0], tiles[2][0]],
    [tiles[0][1], tiles[1][1], tiles[2][1]],
    [tiles[0][2], tiles[1][2], tiles[2][2]],
    [tiles[0][0], tiles[1][1], tiles[2][2]],
    [tiles[0][2], tiles[1][1], tiles[2][0]],
  ];

  const result = solutions
    .map((solution) => solution.filter((tile, i) => tile === solution[0] && tile !== '')).filter(winnerArray => winnerArray.length === 3 ).flat()
    const tie = tiles.map(arr => arr.every(tile=> tile !== '')).filter(modArr => modArr === true).length === 3
  return {gameEnded: result.length === 3 || tie , winner: result[0]};
};

// const useTicTacToeGameState = (initialPlayer) => {
//   const tiles = [
//     { firstRow: [1, 2, 3] },
//     { secondRow: [4, 5, 6] },
//     { thirdRow: [7, 8, 9] },
//   ];

const useTicTacToeGameState = (initialPlayer) => {
  const [tiles, setTiles] = React.useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [currentPlayer, setCurrentPlayer] = React.useState(initialPlayer);

  const {gameEnded,winner} = getWinner(tiles);

  const setTileTo = (rowIndex, tileIndex, player) => {
    const newTiles = [...tiles];

    if (newTiles[rowIndex][tileIndex] === "") {
      newTiles[rowIndex][tileIndex] = player;
    } else return false;

    setTiles(newTiles);
    setCurrentPlayer(player === "X" ? "O" : "X");
  };
 console.log(tiles)
  const restart = () => {
    // Reiniciar el juego a su estado inicial
    const originalTiles = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    setTiles(originalTiles);
  };

  // por si no reconocen esta sintáxis, es solamente una forma más corta de escribir:
  // { tiles: tiles, currentPlayer: currentPlayer, ...}
  return { tiles, currentPlayer, winner, gameEnded, setTileTo, restart };
};

const RestartBtn = (props) => {
  return <button onClick={props.onClick}>Restart</button>;
};

const TicTacToe = () => {
  const { tiles, currentPlayer, winner, gameEnded, setTileTo, restart } =
    useTicTacToeGameState("X");
  return (
    <div className="tictactoe">
      <WinnerCard show={gameEnded} winner={winner} onRestart={restart} />
      {tiles.map((row, rowIndex) => {
        return (
          <div className="tictactoe-row" key={rowIndex}>
            {row.map((tile, i) => {
              return (
                <Square
                  onClick={() => setTileTo(rowIndex, i, currentPlayer)}
                  className="square"
                  key={i}
                  value={tile}
                ></Square>
              );
            })}
          </div>
        );
      })}
      <RestartBtn onClick={restart} />
    </div>
  );
};
export default TicTacToe;
