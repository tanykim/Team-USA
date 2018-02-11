import React, { Component } from 'react';
import Border from './Border';
import Highlight from './Highlight';
import Sports from './Sports';
import data from './data/data.json';

class App extends Component {
  state = {sortBy: 'name-asc', category: 'all'};

  _sortSport = (e) => {
    this.setState({sortBy: e.target.value});
  }

  _highlight = (e) => {
    this.setState({category: e.target.value});
  }

  render() {
    return (<div>
      <Border />
      <div className="container">
        <header>
          <div className="title"> TEAM USA </div>
          <div className="desc"><a href="https://www.youtube.com/watch?v=rRwhm-B6yNI" target="_blank">Age ain't nothing but a number</a>, therefore I made this.</div>
          <div className="source"> with
            <a href="http://www.teamusa.org/road-to-rio-2016/team-usa/athletes" target="_blacnk">2016</a> and
            <a href="https://www.teamusa.org/pyeongchang-2018-olympic-winter-games/team-usa/athletes" target="_blacnk">2018</a>
            U.S. Olympic Team Data
          </div>
        </header>
        <div className="main">
          <div className="options">
            <div className="sort-by">
              <div className="title">Sort</div>
              <select name="sort" onChange={this._sortSport}>
                  <option value="name-asc">Sport name (A to Z)</option>
                  <option value="athletes_count-desc">Number of athletes (large to small)</option>
                  <option value="athletes_count-asc">Number of athletes (small to large)</option>
                  <option value="median_age-desc">Median age (old to young)</option>
                  <option value="median_age-asc">Median age (young to old)</option>
                  <option value="age_diff-desc">Age range (large to small)</option>
                  <option value="age_diff-asc">Age range (small to large)</option>
              </select>
            </div>
            <Highlight count={data.highlight_count} onHighlight={this._highlight}/>
          </div>
          <Sports data={data} {...this.state}/>
        </div>
        <div className="footer">
          <div className="desc">
            Made by <a href="http://tany.kim" target="_blank"> Tanyoung Kim</a> |
            View at <a href="https://github.com/tanykim/Team-USA" tager="_blank">GitHub </a>
          </div>
        <Border isFooter={true}/>
        </div>
      </div>
    </div>);
  }
}

export default App;
