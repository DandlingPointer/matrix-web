/**
 * Created by vogelsang on 17.11.2014.
 */
var Cell = React.createClass({
    render: function() {
        return (
            <td><input type="text" value={this.props.value} onChange={this.props.onChange}></input></td>
        )
    }
});
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
            xy = e.target.props.key.split("|");
        matrix[(xy[0])][(xy[1])] = e.target.value;
        this.setState({data: matrix});
    }
    ,
    render: function() {
        var matrix;
        matrix = this.state.data.map(function(row, x) {
            var rowElements = row.map(function(cellVal, y) {
                return <Cell key={x+"|"+y} onChange={this.onCellChange} value={cellVal}/>;
            });
            return <tr> {rowElements} </tr>;
        });
        return <table> {matrix} </table>;
    }


}, 500);

React.render(
    <Matrix/>,
    document.getElementById("content")
);
