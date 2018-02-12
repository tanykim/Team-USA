import React, { Component } from 'react';

class Sort extends Component {
  render() {
    return (<div className="sort-by">
      <div className="title">Sort</div>
      <select name="sort" onChange={this.props.onSort} value={this.props.sortBy}>
          <option value="name-asc">Sport name (A to Z)</option>
          <option value="athletes_count-desc">Number of athletes (large to small)</option>
          <option value="athletes_count-asc">Number of athletes (small to large)</option>
          <option value="median_age-desc">Median age (old to young)</option>
          <option value="median_age-asc">Median age (young to old)</option>
          <option value="age_diff-desc">Age range (large to small)</option>
          <option value="age_diff-asc">Age range (small to large)</option>
      </select>
    </div>);
  }
}

export default Sort;
