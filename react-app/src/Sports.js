import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

//layout
const divWidth = 970;
const margin = { top: 20, right: 10, bottom: 20, left: 140, gap: 16 };
const dim = { w: divWidth - margin.left - margin.right };
const gHeight = 50;
const x = d3.scaleLinear().range([0, dim.w]);
const y = d3.scaleLinear().range([0, gHeight]);

class Sports extends Component {

  _drawHistogram = (bins, id, option, startAge) => {
    const g = d3.select(`.js-vis-g-${id}`);
    let data;
    if (option === 'all') {
      data = bins.all.map(d => [d, 0]);
    } else {
      data = bins.all.map((d, i) => [bins[option][i], d - bins[option][i]]);
    }
    const remained = option === 'women' ? 'men' : 'returned';
    for (let i in data) {
      const d = data[i];
      const xPos = x(startAge + +i) + 0.5;
      const width = x(startAge + 1) - x(startAge) - 1;
      for (let j in d) {
        if (d[j] > 0) {
          g.append('rect')
            .attr('x', xPos)
            .attr('y', gHeight - (+j === 0 ? y(d[0]) : y(d[1]) + y(d[0])))
            .attr('width', width)
            .attr('height', y(d[j]))
            .attr('class', `bar-${+j === 0 ? option : remained} js-hist-elm`);
        }
      }
    }
  }

  _getAgeText = (d) => {
    const ageYear = Math.floor(d);
    const ageMonth = Math.floor((d - ageYear) * 12);
    return ageYear + ' years ' + (ageMonth > 0 ? ageMonth + ' m' : '')
  }

  _drawSport = (data, id) => {

    const g = d3.select(`.js-vis-g-${id}`);

    const {
      name,
      athletes_count: count,
      median_age: median,
      age_range: ageRange,
      age_hist: hist,
      hist_start_age: startAge,
    } = data;

    //sports name
    g.append('text')
      .attr('x', -9)
      .attr('y', gHeight / 2)
      .text(name)
      .attr('class', 'pos-end v-central js-name');
    g.append('line')
      .attr('x2', dim.w)
      .attr('y1', gHeight)
      .attr('y2', gHeight)
      .attr('class', 'stroke-lightGrey');

    //histogram
    this._drawHistogram(data.age_hist, id, 'all', data.hist_start_age);

    //draw athletes count
    g.append('text')
      .attr('x', -9)
      .attr('y', gHeight - margin.gap)
      .attr('dy', 14)
      .text(count + ' athletes')
      .style('display', 'none')
      .attr('class', 'pos-end size-small fill-sorted web-font js-highlight js-athletes_count');

    //draw median age
    g.append('line')
        .attr('x1', x(median))
        .attr('x2', x(median))
        .attr('y2', gHeight / 2)
        .style('display', 'none')
        .attr('class', 'stroke-sorted js-highlight js-median_age');
    g.append('circle')
        .attr('cx', x(median))
        .attr('cy', gHeight / 4)
        .attr('r', 4)
        .style('display', 'none')
        .attr('class', 'fill-sorted js-highlight js-median_age');
    g.append('text')
        .attr('x', x(median) + 6)
        .attr('y', gHeight / 4)
        .text(this._getAgeText(median))
        .style('display', 'none')
        .attr('class', 'v-central size-small fill-sorted web-font js-highlight js-median_age');

    //draw age range
    g.append('line')
        .attr('x1', x(ageRange[0]))
        .attr('x2', x(ageRange[1]))
        .style('display', 'none')
        .attr('class', 'stroke-sorted js-highlight js-age_diff');
    g.append('circle')
        .attr('cx', x(ageRange[0]))
        .attr('r', 4)
        .style('display', 'none')
        .attr('class', 'fill-sorted js-highlight js-age_diff');
    g.append('circle')
        .attr('cx', x(ageRange[1]))
        .attr('r', 4)
        .style('display', 'none')
        .attr('class', 'fill-sorted js-highlight js-age_diff');
    g.append('text')
        .attr('x', x((ageRange[1] + ageRange[0]) / 2))
        .attr('dy', 4)
        .text(this._getAgeText(ageRange[1] - ageRange[0]))
        .style('display', 'none')
        .attr('class', 'v-top pos-middle size-small fill-sorted web-font js-highlight js-age_diff');

  //labe of count of each age
  for (let i in hist.all) {
    const d = hist.all[i];
    const xPos = x(startAge + +i) + 0.5;
    const width = x(startAge + 1) - x(startAge) - 1;
    if (d > 0) {
      g.append('text')
        .attr('x', xPos + width / 2)
        .attr('y', gHeight - y(d) - 4)
        .text(d)
        .attr('class', 'size-tiny pos-middle');
    }
  }

  }

  _showCategory = (sports, option) => {
    d3.selectAll('.js-hist-elm').remove();
    //draw vis of each sport
    for (let i in sports) {
      this._drawHistogram(sports[i].age_hist, i, option, sports[i].hist_start_age);
    }
  }

  _sortVis = (sports, option) => {
    //resort dataset
    const o = option.split('-');
    const sorted = _.orderBy(sports, [o[0]], [o[1]]).map(d => d.id);

    //transition
    d3.selectAll('.js-vis-g')
      .transition()
      .duration(1000)
      .attr('transform', d =>
        `translate(${margin.left}, ${margin.top + sorted.indexOf(d.id) * (gHeight + margin.gap)})`
      )
      .on('end', () => {
        d3.selectAll('.js-highlight').style('display', 'none');
        d3.selectAll('.js-' + o[0]).style('display', 'block');
      });

  }

  componentDidMount() {

    const {sports, max_age, max_hist_value} = this.props.data;

    //draw vis
    dim.h = sports.length * (gHeight + margin.gap);
    const svg = d3.select('#vis')
        .append('svg')
        .attr('width', dim.w + margin.left + margin.right)
        .attr('height', dim.h + margin.top + margin.bottom);

    //get age range by 10s
    const minAge = 10;
    const maxAge = Math.ceil(max_age / 10) * 10;
    x.domain([minAge, maxAge]);
    //max number of athletes per sport
    y.domain([0, max_hist_value]);

    //draw fixed vertial lines (y axis) in every 5 years, crossing all sports
    //+1 for the last vertical line
    const axisG = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    const axisCount = (maxAge - minAge) / 5;
    for (let i in _.range(axisCount + 1)) {
      const xPos = i * dim.w / axisCount + 0.5;
      axisG.append('line')
        .attr('x1', xPos)
        .attr('x2', xPos)
        .attr('y2', dim.h)
        .attr('class', 'stroke-lightGrey')
        .style('stroke-dasharray', gHeight + ', ' + margin.gap);

      //put age label by every 4th sport
      for (let j in _.range(Math.ceil(sports.length / 4))) {
        const yPos = j * (gHeight + margin.gap) * 4 + gHeight + 4;
        axisG.append('text')
          .attr('x', xPos - 6)
          .attr('y', yPos)
          .text(`${minAge + i * 5} ${i % 3 === 0 && i < axisCount ? 'years old' : ''}`)
          .attr('class', 'size-tiny v-top fill-lightGrey');
      }
    }

    //draw g for each sport
    svg.selectAll('.vis-g')
      .data(sports)
      .enter()
      .append('g')
      .attr('transform', (d, i) =>
        `translate(${margin.left}, ${margin.top + i * (gHeight + margin.gap)})`
      )
      .attr('class', (d, i) => `js-vis-g js-vis-g-${i}`);

    //draw vis of each sport
    for (let i in sports) {
      this._drawSport(sports[i], +i);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.category !== nextProps.category) {
      this._showCategory(nextProps.data.sports, nextProps.category);
    } else if (this.props.sortBy !== nextProps.sortBy) {
      this._sortVis(nextProps.data.sports, nextProps.sortBy);
    }
  }

  render() {
    return (<div id='vis' className='vis'></div>);
  }
}

export default Sports;
