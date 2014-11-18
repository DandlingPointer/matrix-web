/**
 * Created by vogelsang on 17.11.2014.
 */
var config = {
    //max size a matrix can have, if too high, ui will lag and be bloated
    maxSize: 10,
    defaultSize: 3,
    defaultOperator: "+"
}

var Matrix = React.createClass({
    createCell: function(x, y, onCellChange) {
        if (this.props.input === true) {
            return (
                <td key={x + "|" + y}>
                    <input data-x={x} data-y={y} className="matrix-cell" type="text"
                        value={this.props.data[x][y]} onChange={onCellChange}/>
                </td>
            );
        } else {
            return (
                <td key={x+"|"+y}>{this.props.data[x][y]}</td>
            );
        }
    },
    render: function() {
        var matrix = [],
            size = this.props.size;

        for (var x = 0; x < size; x = x + 1) {
            var elemRow = [];
            for (var y = 0; y < size; y = y + 1) {
                elemRow.push(<td key={x+"|"+y}>{this.createCell(x, y, this.props.onChange)}</td>);
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
        var size = config.defaultSize,
            dataM1 = this.createMatrixData(size, -1, null),
            dataM2 = this.createMatrixData(size, -1, null),
            dataM3 = this.createMatrixData(size, -1, null)
            operator = config.defaultOperator;

        return {
            operator: config.defaultOperator,
            size: config.defaultSize,
            dataM1: this.createMatrixData(size, -1, null),
            dataM2: this.createMatrixData(size, -1, null),
            dataM3: this.createMatrixData(size, -1, null)
        };
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
    },
    onOperatorChange: function(e) {
        this.setState({operator: e.target.value});
        this.calculate();
    },

    onMatrixChange1: function(e) { //TODO merge onMatrixChange 1 and 2 with closure
        var matrix = this.state.dataM1,
            x = e.target.getAttribute("data-x"),
            y = e.target.getAttribute("data-y");
        matrix[x][y] = e.target.value;
        this.setState({dataM1: matrix});
        this.calculate();
    },
    onMatrixChange2: function(e) {
        var matrix = this.state.dataM2,
            x = e.target.getAttribute("data-x"),
            y = e.target.getAttribute("data-y");
        matrix[x][y] = e.target.value;
        this.setState({dataM2: matrix});
        this.calculate();
    },
    onSizeChange: function(e) {
        this.setState({
            dataM1: this.createMatrixData(e.target.value, this.state.size, this.state.dataM1),
            dataM2: this.createMatrixData(e.target.value, this.state.size, this.state.dataM2),
            dataM3: this.createMatrixData(e.target.value, this.state.size, this.state.dataM3),
            size: e.target.value
        });
        this.calculate();
    },

    calculate: function() {
        switch (this.state.operator) {
            case "+":
                this.add();
                break;
            default:
                console.error("Unsupported operation! ("+this.state.operator+")");
        }
    },

    add: function() {
        var result = this.state.dataM3;
        for (var x = 0; x < this.state.size; x++) {
            for (var y = 0; y < this.state.size; y++) {
                result[x][y] = Number(this.state.dataM1[x][y]) + Number(this.state.dataM2[x][y]);
            }
        }
        this.setState({dataM3: result});
    },

    render: function() {
        return (
            <div id="matrix-app">
                Size: <input className="size-select" type="text" title="Enter the size" value={this.state.size} onChange={this.onSizeChange}/>
                <Matrix input={true} size={this.state.size} data={this.state.dataM1} onChange={this.onMatrixChange1}/>
                <select onChange={this.onOperatorChange} value={this.state.operator}>
                    <option value="+">+</option>
                    <option value="-">-</option>
                    <option value="*">*</option>
                </select>
                <Matrix input={true} size={this.state.size} data={this.state.dataM2} onChange={this.onMatrixChange2}/>
                =
                <Matrix input={false} size={this.state.size} data={this.state.dataM3}/>
            </div>
        );
    }
});

React.render(
    <MatrixApp />,
    document.getElementById("content")
);
