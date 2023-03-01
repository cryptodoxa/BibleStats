import './App.css';
import backArrow from './images/back.svg';
import React from 'react';
import conc from './data/concordance.json';
import toc from './data/toc.json';
import bible from './data/kjv.json';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

const ggallwords = Object.keys(conc).sort(); 
const ggpunctuationregex = /[.,\/#!$%\^&\*;:{}=\_`~()]/g

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const labels = Object.values(toc);


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      locations: [],
      wordList: [],
      shortestMatch: null,
      lastSearch: null,
      matchCount: 0
    };
  }

  handleOnTextChange = (e) => {
    const value = e.target.value;
    
    if (!value) {
      this.setState({wordList: [], shortestMatch: null, matchCount: 0, lastSearch: null});
    } else {
      const newData = ggallwords.filter(el => el.toLowerCase().includes(value.toLowerCase()));
      const shortestMatch = newData.reduce((a,b) => { return a.length <= b.length ? a : b;});

      this.setState({
        wordList: newData.slice(0,100), // first 100, for performance and readability
        shortestMatch: shortestMatch,
        matchCount: newData.length,
        lastSearch: value
      });
    }
  }

  handleWordClick = (e) => {
    const selected = e.target.dataset.value;
    this.setState({
      selected: selected,
      locations: conc[selected].slice(1)
    });
  }

  handleOnBack = (e) => {
    this.setState({selected: null});
  }

  render() {
    let display;
    if (!this.state.selected){
      display = <WordList words={this.state.wordList} 
      matchCount={this.state.matchCount}
      shortestMatch={this.state.shortestMatch} 
      lastSearch={this.state.lastSearch}
      onChange={this.handleOnTextChange}
      onClick={this.handleWordClick}/>
    } else {
      display = <VerseDisplay 
      selected={this.state.selected}
      onBack={this.handleOnBack}
      />
    }

    return (
      <div className="App">
        <div className="prelude">Welcome to...</div>
        <div className="title">Nifty Bible Stats</div>
        <div className="main-container">
          {display}
        </div>
      </div>
    );
  }
  
}


class WordList extends React.Component {

  render(){
    const matchCount = this.props.matchCount > 100 ? "100+" : this.props.matchCount;
    
    return (
      <div className="wordList">
        <div className="searchTitle">Search for a word!</div>
        <div><input onChange={this.props.onChange} placeholder="search..." value={this.props.lastSearch}/></div>
        <div className="matchCount">{matchCount + " matches"}</div>
        {this.props.words.length > 0 && <div className="title">shortest match:</div> }
        <div className="shortest" onClick={this.props.onClick} data-value={this.props.shortestMatch}>
          {this.props.shortestMatch}
        </div>
        <div>
          {this.props.words.length > 0 && <div className="title">other matches:</div>}
          {this.props.words.map( (word, key) => {
            return (
              <div key={word} >
                <div className="word" onClick={this.props.onClick} data-value={word}>{word}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}


class VerseDisplay extends React.Component {
  constructor(props){
    super(props);
    const count = conc[this.props.selected][0];
    const pageCount = count / 20;
    this.state = {
      page: 0,
      pageSize: 20,
      pageCount: pageCount
    };
  }

  handlePageBack = () => {
    const page = this.state.page - 1 > 0 ? this.state.page - 1 : 0;
    this.setState({page: page});
  }

  handlePageForward = () => {
    const page = this.state.page + 1 < this.state.pageCount - 1 ? this.state.page + 1 : this.state.pageCount - 1;
    this.setState({page: page});
  }

  render() {
    const start = this.state.pageSize * this.state.page + 1;
    const end = start + this.state.pageSize;
    const allLocations = conc[this.props.selected];
    const locations = allLocations.slice(start, end);
    const count = conc[this.props.selected][0];

    const displayLocations = locations.map((location, idx) => {
      return toc[location[1]] + " " + location[2] + ":" + location[3];
    });

    const displayText = locations.map((location, idx) => {
      const text = bible[location[0]];
      const highlights = text.toLowerCase().replace(ggpunctuationregex, "").split(' ').map((t) => {
        if (t == this.props.selected){
          return true
        } else {
          return false
        }
      });
      const results = text.split(' ').map((t, idx) => {
        if(highlights[idx]){
          return "<b>" + t + "</b>"
        } else {
          return t
        }
      }).join(' ');
      return results;
    });

    return (
      <div className="verses">
        <div className="back-button" onClick={this.props.onBack}> <img src={backArrow} 
          alt="back" height="15" width="15"/><span className="back-text"> back</span></div>
        <div className="active-word">
          {this.props.selected} 
        </div>
        <VerseGraph locations={allLocations}/>
        <div className="occurences">({count} occurences)</div>
        <div className="page-buttons">
          { this.state.page > 0 && <span className="back-button" onClick={this.handlePageBack}>&lt; page back</span> }
          { this.state.page < this.state.pageCount - 1 && <span className="forward-button" onClick={this.handlePageForward}>page forward &gt;</span> }
        </div>
        {locations.map( (location, idx) => {
          return (
            <Verse key={displayLocations[idx]+idx} index={displayLocations[idx]} text={displayText[idx]} />  
          )
        })}
      </div>
    )
  }
}


class VerseGraph extends React.Component {

  constructor(props){
    super(props);

    let count = {};
    for (let i = 1; i < labels.length + 1; i++) {
      count[i] = 0;
    }

    const res = props.locations.map((loc) => {return loc[1]}).forEach((loc) => {count[loc] += 1;});

    this.data = {
      labels,
      datasets: [
        {
          label: "",
          data: Object.values(count),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ],
    };

    this.options = {
      responsive: true,
      scales: {
        xAxes: [{
          ticks: {
            fontSize: 6
          }
        }]
      },
      plugins: {
        legend: {
          display: false
        }
      }
    };
  }

  render() {  
  
    return <Bar options={this.options} data={this.data} />;
  }
}


class Verse extends React.Component {

  render() {
    return ( 
      <div className="verse-container">
        <div className="verse-title">
          {this.props.index}
        </div>
        <div className="verse-text" dangerouslySetInnerHTML={{__html: '<span>' + this.props.text + '</span>'}}>
        </div>
      </div>
    )
  }
}

export default App;
