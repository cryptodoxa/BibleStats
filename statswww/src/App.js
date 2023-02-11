import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import conc from './data/concordance.json';
import toc from './data/toc.json';
import bible from './data/kjv.json';
import { render } from '@testing-library/react';

const ggallwords = Object.keys(conc).sort(); 



class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      locations: [],
      wordList: []
    };
  }

  handleOnTextChange = (e) => {
    console.log(e.target.value);
    const value = e.target.value;
    console.log(bible);
    if (!value) {
      this.setState({wordList: []});
    } else {
      const newData = ggallwords.filter(el => el.toLowerCase().includes(value.toLowerCase()));
      this.setState({wordList: newData.slice(0,100)}); // first 100, for performance and readability
    }
  }

  handleWordClick = (e) => {
    const selected = e.target.dataset.value;
    this.setState({
      selected: selected,
      locations: conc[selected].slice(1)
    });
  }

  render() {
    return (
      <div className="App">
        <div className="main-container">
          <div className="list">
            <input onChange={this.handleOnTextChange}/>
            <MatchedList words={this.state.wordList} onClick={this.handleWordClick}/>
          </div>
          <div className="matches">
            <MatchDisplay selected={this.state.selected}/>
          </div>
        </div>
      </div>
    );
  }
  
}


class MatchedList extends React.Component {
  render(){
    return <div>
      {this.props.words.map( (word, key) => {
        return (
          <div key={word} >
            <div className="conc-word" onClick={this.props.onClick} data-value={word}>{word}</div>
          </div>
        )
      })}
    </div>
  }
}


class MatchDisplay extends React.Component {
  render() {
    const locations = this.props.selected ? conc[this.props.selected].slice(1) : []
    const displayLocations = locations.map((location, idx) => {
      return toc[location[1]] + " " + location[2] + ":" + location[3];
    });
    const displayText = locations.map((location, idx) => {
      return bible[location[0]];
    });

    if(this.props.selected) {
      return (
        <div>
          <div>
            {this.props.selected}
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
}

class Verse extends React.Component {

  render() {
    return ( 
      <div className="verse-item">
        <div>
          {this.props.index}
        </div>
        <div>
          {this.props.text}
        </div>
      </div>
    )
  }
}

export default App;
