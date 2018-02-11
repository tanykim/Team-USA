import React, { Component } from 'react';

class Highlight extends Component {
  render() {
    const {all, women, men, rookies, experienced} = this.props.count;

    return (<div className="show" onChange={this.props.onHighlight}>
      <div className="title">Category</div>
      <div>
        <input type="radio" name="highlight" value="all" defaultChecked />
        All Athletes <span className="count">{all}</span>
      </div>
      <div>
        <input type="radio" name="highlight" value="women" />
        Women <span className="count-women" /><span className="count">{women}</span> /
        Men <span className="count-men" /><span className="count">{men}</span>
      </div>
      <div>
        <input type="radio" name="highlight" value="rookies" />
        Rookies <span className="count-rookies" /><span className="count">{rookies}</span> /
        Returning Olympian <span className="count-returned" /><span className="count">{experienced}</span>
      </div>
    </div>);
  }
}

export default Highlight;
