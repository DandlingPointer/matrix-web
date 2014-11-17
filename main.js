/**
 * Created by vogelsang on 17.11.2014.
 */
var config = {
    //max size a matrix can have, if too high, ui will lag and be bloated
    maxSize: 10
}

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
            x = e.target.getAttribute("data-x"),
            y = e.target.getAttribute("data-y");
        matrix[x][y] = e.target.value;
        this.setState({data: matrix});
    },
    createCell: function(x, y) {
        return (
            <td key={x+"|"+y}>
                <input data-x={x} data-y={y} className="matrix-cell" type="text"
                    value={this.state.data[x][y]} onChange={this.onCellChange}/>
            </td>
        );
    },
    onSizeChange: function (e) {
        var size = e.target.value,
            data = []
            oldSize = this.state.size,
            oldData = this.state.data;

        if (isNaN(size) || size < 1 || size > config.maxSize) { //FIXME: isNaN is potentially broken, think of something better
            return
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
        var matrix = [],
            size = this.state.size;
        for (var x = 0; x < size; x = x + 1) {
            var elemRow = [];
            for (var y = 0; y < size; y = y + 1) {
                elemRow.push(this.createCell(x, y));
            }
            matrix.push(<tr>{elemRow}</tr>);
        }

        return (
            <div className="matrix">
                <form>
                    <table className="matrix-table">
                        <tbody>
                            {matrix}
                        </tbody>
                    </table>
                    Size: <input className="size-select" type="text" title="Enter the size" value={this.state.size} onChange={this.onSizeChange}/>
                </form>
            </div>
        );
    }


}, 500);

React.render(
    <Matrix/>,
    document.getElementById("content")
);
