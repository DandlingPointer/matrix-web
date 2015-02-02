/**
 * Created by vogelsang on 17.11.2014.
 */
var config = {
    //max size a matrix can have, if too high, ui will lag and be bloated
    maxSize: 10,
    defaultSize: 3,
    defaultOperator: "+"
}

//FIXME orientation counter-intuitive: y = horizontal axis, x = vertical axis
var calculator = {
    isUnaryOperator(operator) {
        return operator === "transpose" || operator === "invert";
    },

    isScalarOperation(operator) {
        return operator === "*-scalar";
    },
    calculate: function(state) {
        switch (state.operator) {
            case "+":
                if (state.dataM1.length != state.dataM2.length || state.dataM1[0].length != state.dataM2[0].length) {
                    return "For matrix addition, both matrices need to be of the same type (i.e. size)";
                }
                return this.add(state.dataM1, state.dataM2);
            case "*":
                if (state.dataM1[0].length != state.dataM2.length) {
                    return "For matrix multiplication, height of matrix 1 needs to be equal with the width of matrix 2";
                }
                return this.multiply(state.dataM1, state.dataM2);
            case "*-scalar":
                return this.multiplyScalar(state.dataM1, state.scalar);
            case "transpose":
                return this.transpose(state.dataM1);
            default:
                return "Unsupported operation! ("+state.operator+")";
        }
    },

    add: function(dataM1, dataM2) {
        var result = this.createMatrixData(dataM1[0].length, dataM1.length, undefined);
        for (var x = 0; x < result.length; x++) {
            for (var y = 0; y < result[0].length; y++) {
                result[x][y] = Number(dataM1[x][y]) + Number(dataM2[x][y]);
            }
        }
        return result;
    },

    multiplyScalar: function(dataM1, scalar) {
        var result = this.createMatrixData(dataM1.length, dataM1[0].length, undefined);
        for (var x = 0; x < result.length; x++) {
            for (var y = 0; y < result[0].length; y++) {
                result[x][y] = dataM1[x][y] * scalar;
            }
        }
        return result;
    },

    multiply: function(dataM1, dataM2) {
        var result = this.createMatrixData(dataM2[0].length, dataM1.length, undefined),
            cellResult;
        for (var x = 0; x < result.length; x++) {
            for (var y = 0; y < result[0].length; y++) {
                cellResult = 0;
                for (var i = 0; i < dataM1[0].length; i++) {
                    cellResult += Number(dataM1[x][i]) * Number(dataM2[i][y]);
                }
                result[x][y] = cellResult;
            }
        }
        return result;
    },

    transpose: function(dataM1) {
        var result = this.createMatrixData(dataM1.length, dataM1[0].length, undefined);
        for (var x = 0; x < result.length; x++) {
            for (var y = 0; y < result[0].length; y++) {
                result[x][y] = dataM1[y][x];
            }
        }
        return result;
    },
    createMatrixData: function(width, height, oldData) {
        var data = [];
        for (var x = 0; x < height; x++) {
            data[x] = [];
            for (var y = 0; y < width; y++) {
                if (typeof oldData !== "undefined" && x < oldData.length && y < oldData[0].length) {
                    data[x][y] = oldData[x][y];
                } else {
                    data[x][y] = 0;
                }
            }
        }
        return data;
    }
}

var Matrix = React.createClass({
    createCell: function(x, y, data, onCellChange, input) {
        var className = "matrix-cell";
        if (input === true) {
            return (
                <td key={x + "|" + y}>
                    <input data-x={x} data-y={y} className="matrix-cell" type="text"
                        value={data} onChange={onCellChange}/>
                </td>
            );
        } else {
            return (
                <td className="matrix-cell" key={x+"|"+y}>{data}</td>
            );
        }
    },
    render: function() {
        var matrix = [];
        for (var x = 0; x < this.props.data.length; x = x + 1) {
            var elemRow = [];
            for (var y = 0; y < this.props.data[0].length; y = y + 1) {
                elemRow.push(this.createCell(x, y, this.props.data[x][y], this.props.onChange, this.props.input));
            }
            matrix.push(<tr>{elemRow}</tr>);
        }

        return (
            <div className="matrix">
                <table className="matrix-table">
                    <tbody>
                            {matrix}
                    </tbody>
                </table>
            </div>
        );
    }
});

var MatrixApp = React.createClass({
    getInitialState: function() {
        return {
            operator: config.defaultOperator,
            dataM1: calculator.createMatrixData(config.defaultSize, config.defaultSize, undefined),
            dataM2: calculator.createMatrixData(config.defaultSize, config.defaultSize, undefined),
            dataM3: calculator.createMatrixData(config.defaultSize, config.defaultSize, undefined),
            scalar: 0,
            error: ""
        };
    },

    onOperatorChange: function(e) {
        var newState = this.state;
        newState.operator = e.target.value;
        newState.dataM3 = calculator.calculate(newState);
        this.setState(newState);
    },

    onSizeChangeFactory: function(type, matrixNum) {
        return function(e) {
            var oldMatrix = this.state["dataM"+matrixNum],
                width, height, newMatrix, newState = this.state,
                value = e.target.value;
            if (isNaN(value) || value < 1) {
                value = 1;
            }
            if (type === "width") {
                width = value;
                height = oldMatrix.length;
            } else {
                height = value;
                width = oldMatrix[0].length;
            }
            newMatrix = calculator.createMatrixData(width, height, oldMatrix);
            newState["dataM"+matrixNum] = newMatrix;
            newState.dataM3 = calculator.calculate(newState);
            this.setState(newState);
        }.bind(this);
    },

    onMatrixChangeFactory: function (matrixNum) {
        return function(e) {
            var matrix = this.state["dataM"+matrixNum],
                x = e.target.getAttribute("data-x"),
                y = e.target.getAttribute("data-y"),
                newState = this.state;
            matrix[x][y] = e.target.value;
            newState["dataM"+matrixNum];
            newState.dataM3 = calculator.calculate(newState);
            this.setState(newState);
        }.bind(this);
    },

    onScalarChange: function(e) {
        var newState = this.state;
        newState.scalar = e.target.value;
        newState.dataM3 = calculator.calculate(newState);
        this.setState(newState);
    },

    render: function() {
        var matrix1,
            matrix2,
            matrix3;
        matrix1 = (
            <div className="card">
                Width:
                <input className="size-select" type="text" title="Enter the size" value={this.state.dataM1[0].length}
                    onChange={this.onSizeChangeFactory("width", 1)}/>
                Height:
                <input className="size-select" type="text" title="Enter the size" value={this.state.dataM1.length}
                    onChange={this.onSizeChangeFactory("height", 1)}/>
                <Matrix className="matrix-input" input={true} data={this.state.dataM1} onChange={this.onMatrixChangeFactory(1)}/>
            </div>);

        if (calculator.isUnaryOperator(this.state.operator)) {
            matrix2 = "";
        } else if (calculator.isScalarOperation(this.state.operator)) {
            matrix2 = <input className="matrix-cell" type="text"
                value={this.state.scalar} onChange={this.onScalarChange}/>;
        } else {
            matrix2 = (
                <div className="card">
                Width:
                <input className="size-select" type="text" title="Enter the size" value={this.state.dataM2[0].length}
                    onChange={this.onSizeChangeFactory("width", 2)}/>
                Height:
                <input className="size-select" type="text" title="Enter the size" value={this.state.dataM2.length}
                    onChange={this.onSizeChangeFactory("height", 2)}/>
                <Matrix className="matrix-input" input={true} data={this.state.dataM2} onChange={this.onMatrixChangeFactory(2)}/>
                </div>
            );
        }
        if (typeof this.state.dataM3 === "string") {
            matrix3 = <p className="error card"> {this.state.dataM3} </p>
        } else {
            matrix3 = (
                <div className="card">
                <Matrix className="matrix-result" input={false} data={this.state.dataM3}/>
                </div>
            );
        }
        return (
            <div id="matrix-app">
                {matrix1}
                <select className="card" onChange={this.onOperatorChange} value={this.state.operator}>
                    <option value="+">+</option>
                    <option value="*">*</option>
                    <option value="*-scalar">* (scalar)</option>
                    <option value="transpose">transpose</option>
                    <option value="invert">invert</option>
                </select>
                {matrix2}
                <div className="card">
                =
                </div>
                {matrix3}
            </div>
        );
    }
});

React.render(
    <MatrixApp />,
    document.getElementById("content")
);
