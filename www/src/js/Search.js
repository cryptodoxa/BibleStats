import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import conc from '../data/concordance.json';


const ggallwords = Object.keys(conc).sort(); 



const Search = () => {

  const [state, setState] = useState({
    allWords: [],
    wordList: [],
    shortestMatch: null,
    lastSearch: null,
    matchCount: 0
  });

  const handleOnTextChange = (e) => {
    const value = e.target.value;
    const newData = ggallwords.filter(el => el.toLowerCase().includes(value.toLowerCase()));
    
    if (!value) {
      setState({allWords: newData.slice(), wordList: [], shortestMatch: null, matchCount: 0, lastSearch: ""});
    } else {
      const shortestMatch = newData.reduce((a,b) => { return a.length <= b.length ? a : b;});
  
      setState({
        allWords: newData.slice(),
        wordList: newData.slice(0,100), // first 100, for performance and readability
        shortestMatch: shortestMatch,
        matchCount: newData.length,
        lastSearch: value
      });
    }
  }

  const matchCount = state.matchCount > 100 ? "100+" : state.matchCount;
  
  return (
    <div className="wordList">
      <div className="searchTitle">Search for a word!</div>
      <div><input onChange={handleOnTextChange} placeholder="search..." value={state.lastSearch}/></div>
      {state.wordList.length > 0 && 
      <div>
        <div className="matchCount">{matchCount + " matches"}</div>
        <div className="title">shortest match:</div> 
        <div className="shortest">
          <Link to={`/concordance/display/`+ state.shortestMatch}>{state.shortestMatch}</Link>
        </div>
        <div>
          {state.allWords.length > 0 && <div className="title">other matches:</div>}
          {state.wordList.map( (word, key) => {
            return (
              <div key={word} >
                  <Link to={`/concordance/display/`+ word} >{word}</Link>
              </div>
            )
          })}
        </div>
      </div>}
    </div>
  )
}

export default Search