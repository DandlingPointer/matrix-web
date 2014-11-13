var Matrix = React.createClass({
  getInitialState: function() {
    return {size: 2,
            value: [[][]]};
  },
  sizeChange: function(e) {
    var val = [], i;
    this.setState({size: e.target.value});
  }
  render: function() {
    var size = this.state.size, x, y, inputs = [];
    for (x = 0; x < size; x = x + 1) {
        inputs.push(

        );
    }
    return (
    <div>
        <input type="text" value={size} onChange={this.sizeChange}/>
    </div>
    );
  }
});

React.render(
  <Matrix />,
  document.getElementById('wrap')
);
