import { useEffect, useReducer, useRef, useState } from 'react';
import './App.css';

function App() {
  const currentPlayer = useRef("X");

  const [winner, setWinner] = useState(null);
  const moves = useRef(0);

  const initialBoardState = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];

  function boardReducer(currentBoard, action) {
    const updatedState = [...currentBoard];

    if(action.type === "board-mark-field") {
      updatedState[action.info.x][action.info.y] = action.info.value;
    } else if(action.type ==="clear-board") {
      return initialBoardState;
    }
    

    return updatedState;
  }

  const [board, dispatch] = useReducer(boardReducer, initialBoardState);

  function markField(x, y) {
    if(winner) return;

    const value = currentPlayer.current;
    
    if(!board[x][y]) {
      dispatch({ type: "board-mark-field", info: { value, x, y } });

      currentPlayer.current = value === "X" ? "O" : "X";
      moves.current++;
    }
  }

  function resetBoard() {
    dispatch({ type: "clear-board" });
    currentPlayer.current = "X";
    moves.current = 0;
  }

  function verifyGameStatus() {
    let hasWinner = false;
    
    for (let i = 0; i < 3; i++) {
      // iª linha
      const value = board[i].find(element => element !== null);

      if(value) {
        hasWinner = board[i].every(element => element === value); 

        if(hasWinner) return value;
      }
    }

    for (let j = 0; j < 3; j++) {
      // iª coluna
      const columns = [board[0][j], board[1][j], board[2][j]];
      
      const value = columns.find(element => element !== null);

      if(value) {
        hasWinner = columns.every(element => element === value); 

        if(hasWinner) return value;
      }
    }

    if(
      (board[0][0] === board[1][1] && board[0][0] === board[2][2]) ||
      (board[0][2] === board[1][1] && board[0][2] === board[2][0])
    ) {
      return board[1][1];
    }

    return null;
  }

  useEffect(() => {
    const winner = verifyGameStatus();

    setWinner(winner);
    // eslint-disable-next-line
  }, [board]);

  return (
    <div className="content">
      <header>
        <h1>Jogo da Velha</h1>
      </header>

      <main>
        <table>
          <tbody>
            {
              board.map((row, x) => (
                <tr key={x.toString()}>
                  {
                    row.map((data, y) => (
                      <td className={(winner || moves.current === 9) ? "disabled" : ""} key={y.toString()} onClick={() => markField(x, y)}>
                        {data}
                      </td>
                    ))
                  }
                </tr>
              ))
            }
          </tbody>
        </table>

        {
          (winner || moves.current === 9) && (
            <div className="end-game-content">
              <span>
                {
                  winner ? `Ganhador: ${winner}` : "Empate"
                }
              </span>
              <button onClick={resetBoard}>Reiniciar Jogo</button>
            </div>
          )
        }
      </main>
    </div>
  );
}

export default App;
