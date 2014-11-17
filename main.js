/**
 * Created by vogelsang on 17.11.2014.
 */

var Matrix = React.createClass({
    getInitialState: function() {
        var size = 3,
            data = [];
        for (var x = 0; x < size; x++) {
            data[x] = [];
            for (var y = 0; y < size; y++) {
                data[x][y] = 0;
            }
        }
        return {size: size, data: data};
    },

    onCellChange: function(e) {
        var matrix = this.state.data,
            x = e.target.getAttribute('data-x'),
            y = e.target.getAttribute('data-y');
        matrix[x][y] = e.target.value;
        this.setState({data: matrix});
    },
    createCell: function(x, y, val) {
        return (
            <td key={x+"|"+y}>
                <input data-x={x} data-y={y} pattern="[0-9]+" class="matrix-cell" type="text"
                    value={val} onChange={this.onCellChange} size="5">
                </input>
            </td>
        );
    },
    onSizeChange: function (e) {
        var size = e.target.value,
            data = []
            oldSize = this.state.size,
            oldData = this.state.data;

        if (isNaN(size) || size < 1 || size > 10) { //FIXME: isNaN is potentially broken, think of something better
            this.setState({size: size});
            return;
        }

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
        this.setState({size: size, data: data});
    },
    render: function() {
        var createCell = this.createCell; //FIXME: ugly way to fix the problem
        var matrix;
        matrix = this.state.data.map(function(row, x) {
            var rowElements = row.map(function(cellVal, y) {
                return createCell(x, y, cellVal);
            });
            console.log(rowElements);
            return <tr key={"row"+x}> {rowElements} </tr>;
        });
        return (
            <div class="matrix">
                <form>
                <table class="matrix-table"> <tbody> {matrix} </tbody></table>
                <input type="text" title="Enter the size" pattern="[0-9]+" value={this.state.size} onChange={this.onSizeChange}/>
                </form>
            </div>
        );
    }


}, 500);

React.render(
    <Matrix/>,
    document.getElementById("content")
);
