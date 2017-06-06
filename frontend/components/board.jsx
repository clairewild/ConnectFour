import React from 'react';
import ReactDOM from 'react-dom';
import merge from 'lodash/merge';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: this.createGrid(),
      player1: true,
      won: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.reset = this.reset.bind(this);
    this.checkWin = this.checkWin.bind(this);
  }

  createGrid() {
    const grid = new Array(6);
    for (let i = 0; i < 6; i++) {
      grid[i] = [null, null, null, null, null, null, null];
    }
    return grid;
  }

  handleClick(e) {
    const color = (this.state.player1 ? "red" : "yellow");
    const x = parseInt(e.target.getAttribute("data-x"));
    let y = "undefined"

    for (let i = 5; i >= 0; i--) {
      if (this.state.grid[i][x] == null) {
        y = i;
        break;
      }
    }
    if (y == "undefined") { return; }

    const newGrid = merge([], this.state.grid);
    newGrid[y][x] = color;
    this.setState({
      grid: newGrid,
      player1: !this.state.player1
    }, () => this.checkWin(x, y, color));
  }

  reset() {
    this.setState({
      grid: this.createGrid(),
      won: null
    });
  }

  checkWin(x, y, color) {
    let horizonalCount = 0;
    let vertCount = 0;

    let i = 0;
    while (this.state.grid[y][x - i] == color) {
      horizonalCount++;
      i++;
    }
    let j = 0;
    while (this.state.grid[y][x + j] == color) {
      horizonalCount++;
      j++;
    }

    let k = 0;
    while (y + k < 6 && this.state.grid[y + k][x] == color) {
      vertCount++;
      k++;
    }

    if (horizonalCount >= 4 || vertCount >= 4) {
      this.handleWin(color);
    }
  }

  handleWin(color) {
    this.setState({
      won: color
    }, () => setTimeout(this.reset, 3000));
  }

  render() {
    const divGrid = this.state.grid.map(array => {
      return (
        <div className="grid-row">
          { array.map((square, i) => (
              <div onClick={ this.handleClick } className={ `grid-square ${square}` } data-x={ i }></div>
            ))
          }
        </div>
      );
    });

    const won = (this.state.won ? <h3>{ `${this.state.won} wins!` }</h3> : "")

    return (
      <div>
        <div className="grid">
          { divGrid }
        </div>

        <div onClick={ this.reset } className="reset-button">RESET</div>

        { won }
      </div>
    );
  }
}

export default Board;
