import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square({ value, onClick }) {
    return (
        <button className="square" onClick={onClick}>
            {value}
        </button>
    );
}


class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={ () => this.props.onClick(i)}
            />
        );
    }

    initialBoard(winner) {
        const board = []
        const arr_row = []
        const rows = this.props.row
        const cols = this.props.col

        for (let row = 0; row < rows; row++) {
            let arr_col = []
            for (let col = 0; col < cols; col++) {
                const val_key = row * rows + col
                if(winner !== null && winner.array_for_win && winner.array_for_win !== null){
                    let isValidSquareForWinner = false
                    for(let postion_for_win = 0; postion_for_win < winner.array_for_win.length; postion_for_win++){
                        const square_win = winner.array_for_win[postion_for_win]
                        if(val_key === square_win){
                            isValidSquareForWinner = true
                            
                        }
                    }
                    if(isValidSquareForWinner){
                        arr_col.push(
                            <span key={'col_' + val_key} className='winner'>
                                {this.renderSquare(val_key)}
                            </span>
                        )
                    }
                    else{
                        arr_col.push(
                            <span key={'col_' + val_key}>
                                {this.renderSquare(val_key)}
                            </span>
                        )
                    }
                }
                else {
                    arr_col.push(
                        <span key={'col_' + val_key}>
                            {this.renderSquare(val_key)}
                        </span>
                    )
                }
            }

            arr_row.push(
                <div className='board-row' key={row}>
                    {arr_col}
                </div>
            )
        }
        board.push(
            <div key={'main-board'} className='main-boar'>
                {arr_row}
            </div>
        )
        return board
    }

    render() {
        return (
            <div>
                <div className='board'>
                    {this.initialBoard(this.props.winner)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            rows: 6,
            cols: 6,
            history: [{  
                squares: Array(6 * 6).fill(null),
            },],
            xIsNext: true,
            stepNumber: 0,
            typeSort: true, //true: Descending, false: Ascending
        }
    }

    jumpTo(e, step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })

        const allMove = document.getElementsByClassName('move');
        for(let move = 0; move < allMove.length; move++){
            let moveObj = allMove.item(move)
            moveObj.className = moveObj.className.replace(/\bcurrent-select-move\b/g, "");
        }

        const id = e.target.id;
        const currentMove = document.getElementById(id)
        currentMove.classList.add("current-select-move");
    }

    handleClick(i) {
        const { rows, cols, stepNumber } = this.state;
        const history = this.state.history.slice(0, stepNumber + 1);
        const currentHistory = history[history.length - 1] ;
        const squares = currentHistory.squares.slice();
        if (calculateWinner(squares, rows, cols) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });

        const allMove = document.getElementsByClassName('move');
        for(let move = 0; move < allMove.length; move++){
            let moveObj = allMove.item(move)
            moveObj.className = moveObj.className.replace(/\bcurrent-select-move\b/g, "");
        }
    }

    changeTypeSort() {
        const { typeSort } = this.state;
        this.setState({
            typeSort: !typeSort
        })
    }

    render() {
        const { history, xIsNext, rows, cols, stepNumber, typeSort } = this.state;
        const currentHistory = history[stepNumber]

        const winner = calculateWinner(currentHistory.squares, rows, cols);
        let moves = history.map( (step, move) => {
            const description = move ? 'Go to move ' + move : "Start";
            const keyMove = 'Move-' + move
            const currentSelectedMove = (move === (history.length - 1)) ? true : false
            return (
                <li key={ keyMove } >
                    <button id={ keyMove } className={currentSelectedMove ? 'current-select-move move' : 'move'} onClick={ (e) => this.jumpTo(e, move)}>
                        {description}
                    </button>
                </li>
            );
        });

        if(!typeSort) {
            moves = moves.reverse();
        }

        let status = '';
        if(winner && winner.isFullBoard && winner.isFullBoard === true){
            status = 'Draw';
        }
        else if (winner) {
            status = 'Winner: ' + winner.player;
        } 
        else {
            status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <div className='status-game'>
                        { status }
                    </div>
                    <div className='board'>
                        <Board row={rows} col={cols} winner={ winner } 
                            onClick={ (e, i) => this.handleClick(e, i) }
                            squares={currentHistory.squares}
                        />
                    </div>
                </div>
                <div className="game-info">
                    <div className='title-history-move'>
                        History Moves
                    </div>
                    <div className='wrap-sort'>
                        <div className='title-sort'>
                            Sort:
                        </div>
                        <div className='wrap-btn-sort'>
                            <button id='btn-sort' onClick={() => { this.changeTypeSort() }}> 
                                { typeSort ? 'Descending' : 'Ascending'}
                            </button>
                        </div>
                    </div>
                    <div className='wrap-history-move'>
                        <ol>
                            { moves }
                        </ol>
                    </div>
                </div>
            </div>
        );
    }
}

//https://www.geeksforgeeks.org/zigzag-or-diagonal-traversal-of-matrix/
// A utility function to find min of two integers 
function minu(a, b) 
{ return (a < b)? a: b; } 
  
// A utility function to find min of three integers 
function min(a, b, c) 
{ return minu(minu(a, b), c);} 
  
// A utility function to find max of two integers 
function max(a, b) 
{ return (a > b)? a: b; } 

// The main function that prints given matrix in diagonal order 
function diagonalOrder(ROW, COL) 
{ 
    let arr_condition_diagonalOrder = []
    // There will be ROW+COL-1 lines in the output 
    for (let line=1; line<=(ROW + COL -1); line++) 
    { 
        // Left
        let condition_each_diagonal = []

        /* Get column index of the first element in this line of output. 
           The index is 0 for first ROW lines and line - ROW for remaining 
           lines  */
        let start_col =  max(0, line-ROW); 
  
        /* Get count of elements in this line. The count of elements is 
           equal to minimum of line number, COL-start_col and ROW */
        let count = min(line, (COL-start_col), ROW); 


        /* Print elements of this line */
        for (let j=0; j<count; j++){
            condition_each_diagonal.push((minu(ROW, line)-j-1) * ROW + (start_col+j))
        } 
  
        /* Ptint elements of next diagonal on next line */
        arr_condition_diagonalOrder.push(condition_each_diagonal)
    } 
    return arr_condition_diagonalOrder
} 

function diagonalOrderRight(ROW, COL) 
{ 
    let arr_condition_diagonalOrder = []
    
    for(let row = ROW * COL - COL, num_row = 0; row >= 0 ; row -= COL, num_row++){
        let arr_condition = []
        arr_condition.push(row)
        for(let col = 1; col <= num_row; col++ ){
            arr_condition.push(row + COL*col + col)
        }
        arr_condition_diagonalOrder.push(arr_condition)
    }    

    for(let col = COL - 1, num_col = 0; col > 0 ; col--, num_col++){
        let arr_condition = [] 
        arr_condition.push(col)
        for(let row = 1; row <= num_col; row++ ){
            arr_condition.push(col + COL*row + row)
        }
        arr_condition_diagonalOrder.push(arr_condition)
    }
    console.log(arr_condition_diagonalOrder)
    return arr_condition_diagonalOrder
} 

function calculateWinner(squares, rows, cols) {
    let conditionWin = []
    // Condition for rows - cols
    for(let i = 0; i < rows; i++){
        let conditionRow = []
        let conditionCol = []
        for(let j = 0; j < cols; j++){
            conditionRow.push(i*rows + j)
            if(conditionRow.length > 4){
                const validConditionRow = [...conditionRow]
                conditionWin.push(validConditionRow)
                conditionRow.splice(0, 1)
            }

            conditionCol.push(j*cols + i)
            if(conditionCol.length > 4){
                const validConditionCol = [...conditionCol]
                conditionWin.push(validConditionCol)
                conditionCol.splice(0, 1)
            }
        }
    }

    // Condition for diagonal line
    const arr_condition_diagonal = diagonalOrder(rows, cols)
    for(let i = 0 ; i < arr_condition_diagonal.length; i++){
        if(arr_condition_diagonal[i] === 4){
            conditionWin.push(arr_condition_diagonal[i])
        }
        else if(arr_condition_diagonal[i].length > 4){
            let child_diagonal = []
            for(let position_diagonal = 0; position_diagonal < arr_condition_diagonal[i].length; position_diagonal++){
                child_diagonal.push(arr_condition_diagonal[i][position_diagonal])
                if(child_diagonal.length > 4){
                    const valid_child_diagonal = [...child_diagonal]
                    conditionWin.push(valid_child_diagonal)
                    child_diagonal.splice(0, 1)
                }
            }
        }
    }

    const arr_condition_diagonal_right = diagonalOrderRight(rows, cols)
    for(let i = 0 ; i < arr_condition_diagonal_right.length; i++){
        if(arr_condition_diagonal_right[i] === 4){
            conditionWin.push(arr_condition_diagonal_right[i])
        }
        else if(arr_condition_diagonal_right[i].length > 4){
            let child_diagonal = []
            for(let position_diagonal = 0; position_diagonal < arr_condition_diagonal_right[i].length; position_diagonal++){
                child_diagonal.push(arr_condition_diagonal_right[i][position_diagonal])
                if(child_diagonal.length > 4){
                    const valid_child_diagonal = [...child_diagonal]
                    conditionWin.push(valid_child_diagonal)
                    child_diagonal.splice(0, 1)
                }
            }
        }
    }

    for (let i = 0; i < conditionWin.length; i++) {
        if(conditionWin[i].length === 5){
            let isWin = true

            for(let j = 0; j < conditionWin[i].length -1; j++){
                const position = conditionWin[i][j]
                const next_position = conditionWin[i][j+1]
                if(!(squares[position] && squares[position] === squares[next_position])){
                    isWin = false
                }
            }

            if(isWin === true){
                const result = {
                    player: squares[conditionWin[i][0]],
                    array_for_win: conditionWin[i]
                }
                return result
            }
        }
    }
    let isFullBoard = true
    for(let i = 0; i < squares.length; i++){
        if(squares[i] === null){
            isFullBoard = false
        }
    } 
    
    if(isFullBoard === true){
        const resultFullBoar = {
            isFullBoard: true
        }
        return resultFullBoar
    }
    return null
}
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
