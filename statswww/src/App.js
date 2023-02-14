import './App.css';
import React, { useState } from 'react';
import conc from './data/concordance.json';
import toc from './data/toc.json';
import bible from './data/kjv.json';

const ggallwords = Object.keys(conc).sort(); 
const ggpunctuationregex = /[.,\/#!$%\^&\*;:{}=\_`~()]/g


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      locations: [],
      wordList: [],
      shortestMatch: null
    };
  }

  handleOnTextChange = (e) => {
    console.log(e.target.value);
    const value = e.target.value;
    console.log(bible);
    if (!value) {
      this.setState({wordList: [], shortestMatch: null});
    } else {
      const newData = ggallwords.filter(el => el.toLowerCase().includes(value.toLowerCase()));
      const shortestMatch = newData.reduce((a,b) => { return a.length <= b.length ? a : b;});
      console.log(shortestMatch);
      this.setState({
        wordList: newData.slice(0,100), // first 100, for performance and readability
        shortestMatch: shortestMatch
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

  render() {
    return (
      <div className="App">
        <div className="title">Super Concordance</div>
        <div className="main-container">
          <div className="list">
            <input onChange={this.handleOnTextChange} placeholder="search..."/>
            <MatchedList words={this.state.wordList} shortestMatch={this.state.shortestMatch} onClick={this.handleWordClick}/>
          </div>
          <div className="verses">
            <VerseDisplay selected={this.state.selected}/>
          </div>
        </div>
      </div>
    );
  }
  
}


class MatchedList extends React.Component {
  render(){
    return (
      <div className="matchedList">
        <div className="shortest" onClick={this.props.onClick} data-value={this.props.shortestMatch}>
          {this.props.shortestMatch}
        </div>
        <div>
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
  render() {
    const locations = this.props.selected ? conc[this.props.selected].slice(1) : []
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

    if(this.props.selected) {
      return (
        <div>
          <div className="active-word">
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
