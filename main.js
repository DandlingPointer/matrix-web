/**
 * Created by vogelsang on 17.11.2014.
 */
var config = {
    //max size a matrix can have, if too high, ui will lag and be bloated
    maxSize: 10,
    defaultSize: 3,
    defaultOperator: "+"
}

var calculator = {
    isUnaryOperator(operator) {
        return operator === "transpose" || operator === "invert";
    },

    isScalarOperation(operator) {
        return operator === "scalar multiplication";
    },
    calculate: function(operator, size, dataM1, dataM2, dataM3) {
        switch (operator) {
            case "+":
                return this.add(size, dataM1, dataM2, dataM3);
                break;
            case "*":
                return this.multiply(size, dataM1, dataM2, dataM3);
                break;


            default:
                console.error("Unsupported operation! ("+operator+")");
                return dataM3;
        }
    },

    add: function(size, dataM1, dataM2, dataM3) {
        for (var x = 0; x < size; x++) {
            for (var y = 0; y < size; y++) {
                dataM3[x][y] = Number(dataM1[x][y]) + Number(dataM2[x][y]);
            }
        }
        return dataM3;
    },

    multiply: function(size, dataM1, dataM2, dataM3) {
        var cellResult;
        for (var x = 0; x < size; x++) {
            for (var y = 0; y < size; y++) {
                cellResult = 0;
                for (var i = 0; i < size; i++) {
                    cellResult += Number(dataM1[x][i]) * Number(dataM2[i][y]);
                }
                dataM3[x][y] = cellResult;
            }
        }
        return dataM3;
    },
    createMatrixData: function(size, oldSize, oldData) {
        var data = [];
        for (var x = 0; x < size; x++) {
            data[x] = [];
            for (var y = 0; y < size; y++) {
                if (x < oldSize && y < oldSize) {
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
                <td key={x+"|"+y}>{data}</td>
            );
        }
    },
    render: function() {
        var matrix = [],
            size = this.props.size;

        for (var x = 0; x < size; x = x + 1) {
            var elemRow = [];
            for (var y = 0; y < size; y = y + 1) {
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
            size: config.defaultSize,
            dataM1: calculator.createMatrixData(config.defaultSize, -1, null),
            dataM2: calculator.createMatrixData(config.defaultSize, -1, null),
            dataM3: calculator.createMatrixData(config.defaultSize, -1, null)
        };
    },

    onOperatorChange: function(e) {
        this.setState({
            operator: e.target.value,
            dataM3: calculator.calculate(
                e.target.value,
                this.state.size,
                this.state.dataM1,
                this.state.dataM2,
                this.state.dataM3)
        });
    },

    onMatrixChange1: function(e) { //TODO merge onMatrixChange 1 and 2 with closure
        var matrix = this.state.dataM1,
            x = e.target.getAttribute("data-x"),
            y = e.target.getAttribute("data-y");
        matrix[x][y] = e.target.value;
        this.setState({
            dataM1: matrix,
            dataM3: calculator.calculate(
                this.state.operator,
                this.state.size, matrix,
                this.state.dataM2,
                this.state.dataM3)
        });
    },
    onMatrixChange2: function(e) {
        var matrix = this.state.dataM2,
            x = e.target.getAttribute("data-x"),
            y = e.target.getAttribute("data-y");
        matrix[x][y] = e.target.value;
        this.setState({
            dataM2: matrix,
            dataM3: calculator.calculate(
                this.state.operator,
                this.state.size,
                this.state.dataM1,
                matrix,
                this.state.dataM3)
        });
    },
    onSizeChange: function(e) {
        var size = e.target.value;
        var dataM1 = calculator.createMatrixData(size, this.state.size, this.state.dataM1);
        var dataM2 = calculator.createMatrixData(size, this.state.size, this.state.dataM2);
        var dataM3 = calculator.createMatrixData(size, -1, null)
        dataM3 = calculator.calculate(this.state.operator, size, dataM1, dataM2, dataM3);
        this.setState({
            dataM1: dataM1,
            dataM2: dataM2,
            dataM3: dataM3,
            size: size
        });
    },

    render: function() {
        var matrix1 = <Matrix className="matrix-input" input={true} size={this.state.size} data={this.state.dataM1} onChange={this.onMatrixChange1}/>,
            matrix2,
            matrix3 = <Matrix className="matrix-result" input={false} size={this.state.size} data={this.state.dataM3}/>;
        if (calculator.isUnaryOperator(this.state.operator)) {
            matrix2 = <br/>;
        } else {
            matrix2 = <Matrix className="matrix-input" input={true} size={this.state.size} data={this.state.dataM2} onChange={this.onMatrixChange2}/>;
        }

        return (
            <div id="matrix-app">
                Size: <input className="size-select" type="text" title="Enter the size" value={this.state.size} onChange={this.onSizeChange}/>
                {matrix1}
                <select className="operator-select" onChange={this.onOperatorChange} value={this.state.operator}>
                    <option value="+">+</option>
                    <option value="*">*</option>
                    <option value="transpose">transpose</option>
                    <option value="invert">invert</option>
                </select>
                {matrix2}
                =
                {matrix3}
            </div>
        );
    }
});

React.render(
    <MatrixApp />,
    document.getElementById("content")
);
