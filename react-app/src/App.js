import React, { Component } from 'react';
import Border from './Border';
import Sort from './Sort';
import Highlight from './Highlight';
import Sports from './Sports';

/* update this when new Olympics are added */
const years = [
  {year: 2018, location: 'Pyeongchang'},
  {year: 2016, location: 'Rio'},
];

const data = {}
for (let y of years) {
  data[y.year] = require(`./data/data-${y.year}.json`);
}

class App extends Component {

  constructor(props) {
    super(props);
    const lastestYear = years[0].year;
    this.state = {
      year: lastestYear,
      sortBy: 'name-asc',
      category: 'all'
    };
  }

  _onSelectGame = (e) => {
    this.setState({
      year: e.target.value,
      sortBy: 'name-asc',
      category: 'all'
    });
  }

  _sortSport = (e) => {
    this.setState({sortBy: e.target.value});
  }

  _highlight = (e) => {
    this.setState({category: e.target.value});
  }

  render() {
    return (<div className="container">
      <Border />
      <div className="row header">
        <div className="col-xs-12 title">TEAM * USA</div>
        <div className="col-xs-12 desc">
          Explore Olympic Athletes' Age by Their Sport
        </div>
        <div className="col-xs-12 source">
          Select Olympic Games
          <select name="sort" onChange={this._onSelectGame} year={this.state.year}>
            {years.map(y => <option
              key={y.year}
              value={y.year}>
              {y.year} {y.location} ({y.year % 4 === 0 ? 'Winter' : 'Summer'}
              {` `}/ {data[y.year].sports.length} Sports)
            </option>)}
          </select>
        </div>
      </div>
      <div className="row options">
        <div className="col-xs-12 col-sm-6 col-md-5 col-md-offset-1 col-lg-3 col-lg-offset-3 end-sm">
          <Sort onSort={this._sortSport} sortBy={this.state.sortBy}/>
        </div>
        <div className="col-xs-12 col-sm-6">
          <Highlight
            count={data[this.state.year].highlight_count}
            onHighlight={this._highlight}
            category={this.state.category}/>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12 center-xs">
          <Sports {...this.state} data={data[this.state.year]}/>
        </div>
      </div>
      <div className="row footer">
        <div className="col-xs-12 desc">
          <span className="elm">
            Made by <a
              href="http://tany.kim"
              target="_blank"
              rel="noopener noreferrer"> Tanyoung Kim</a>
          </span>
          <span className="elm">
            View at <a
              href="https://github.com/tanykim/team-usa"
              tager="_blank"
              rel="noopener noreferrer">GitHub </a>
          </span>
          <span>
            Data Sources
            {` `}<a
              href="http://www.teamusa.org/road-to-rio-2016/team-usa/athletes"
              target="_blacnk"
              rel="noopener noreferrer">2016</a>
            {` `}and
            {` `}<a
              href="https://www.teamusa.org/pyeongchang-2018-olympic-winter-games/team-usa/athletes"
              target="_blacnk"
              rel="noopener noreferrer">2018</a>
          </span>
        </div>
      </div>
      <Border isFooter={true}/>
    </div>);
  }
}

export default App;