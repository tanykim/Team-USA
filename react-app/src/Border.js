import React, { Component } from 'react';

class Border extends Component {
  render() {
    return (<div className={`olympic-border${this.props.isFooter ? '-footer' : ''}`}>
      <div className="blue"></div>
      <div className="yellow"></div>
      <div className="black"></div>
      <div className="green"></div>
      <div className="red"></div>
    </div>);
  }
}

export default Border;
