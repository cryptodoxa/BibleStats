import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import animals from './data/animals.json';
import conc from './data/concordance.json';

const words = Object.keys(conc).sort();


function App() {
  const [selected, setSelected] = useState("");
  return (
    <div className="App">
      <div className="list">
        <TextSearch />
      </div>
      <div className="matches">
        <MatchDisplay />
      </div>
    </div>
  );


  function MatchDisplay() {
    return (
      <div>
        {selected}
      </div>
    )
  }

  function TextSearch(){
    const [data, setData] = useState([]);

    function handleOnChange(e) {
      const value = e.target.value;
      if (!value) {
        setData([]);
      } else {
        const newData = words.filter(el => 
          el.toLowerCase().includes(value.toLowerCase()));
        setData(newData);
      }
      
      
    }

    function handleWordClick(e) {
      setSelected(e.target.dataset.value);
    }

    function MatchedList(){
      return <div>
        {data.map( (word, key) => {
          return (
            <div key={word} data-value={word} onClick={handleWordClick}>
              {word}
            </div>
          )
        })}
      </div>
    }

    return (
      <div>
        <input onChange={handleOnChange}/>
        <MatchedList />
      </div>
    );

  }
}


export default App;
