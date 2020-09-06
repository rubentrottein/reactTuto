import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import './index.css';

function Square(props) {
    // /!\le onClick appelé par le onClick du DOM est une fonction perso
    return (
        <button
            className="square"
            //On peut abréger onClick()
            onClick={props.onClick}
        >
        {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        //return + "(" permet de ne pas considerer le return comme autonome quand on saute des lignes
        return (
            //l'appel de square ici signifie qu'on passe les props de Board à Square
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}    
            />
        );
    }
    render() {
        return (
            <div>
            <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
            </div>
            <div className="board-row">
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
            </div>
            <div className="board-row">
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
            </div>
        );
    }
}
class Game extends React.Component {
    constructor(props){
        //toujours appeler super pour un constructeur de sous-classe
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length - 1];
        //?? Slice crée un nouveau tableau afin de gerer les modif localement(?)
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]){
            //empêcher le click si le vainqueur est déterminé.
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O"; //if(xIsNext=true){return"x"} else {return"o"}
        this.setState({
            history: history.concat([{
                //on choisis la methode concat() qui push sans modifier l'array d'origine
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Revenir au tour n°' + move :
                'Revenir au début de la partie';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner){
            status = winner + " a gagné!";
        } else {
            status = 'Prochain Joueur: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
  
  function calculateWinner(squares){
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
              return squares[a];
          }
      }
      return null;
  }
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  