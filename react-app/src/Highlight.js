import React, { Component } from 'react';

class Highlight extends Component {

 render() {
    const {all, women, men, rookies, experienced} = this.props.count;

    return (<div className="show" onChange={this.props.onHighlight} >
      <div className="title">Highlight</div>
      <div className="elm">
        <div>
          <input
            type="radio" name="highlight" value="all"
            checked={this.props.category === 'all'}
            readOnly/>
        </div>
        <div>All Athletes <span className="count-all">{all}</span></div>
      </div>
      <div className="elm">
        <div>
          <input
            type="radio" name="highlight" value="men"
            checked={this.props.category === 'men'}
            readOnly/>
        </div>
        <div>
          Women <span className="count-women">{women}</span> &amp;
          Men <span className="count-men">{men}</span>
        </div>
      </div>
      <div className="elm">
        <div>
          <input
            type="radio" name="highlight" value="rookies"
            checked={this.props.category === 'rookies'}
            readOnly/>
        </div>
        <div>
          Returning Olympians <span className="count-returned">{experienced}</span> &amp;
          Rookies <span className="count-rookies">{rookies}</span>
        </div>
      </div>
    </div>);
  }
}

export default Highlight;