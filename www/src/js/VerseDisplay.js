import backArrow from '../images/back.svg';
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import conc from '../data/concordance.json';
import toc from '../data/toc.json';
import bible from '../data/kjv.json';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';

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


const VerseDisplay = () => {

  const params = useParams();

  const count = conc[params.word][0];
  const pageSize = 20;
  const pageCount = count / pageSize;
  const [state, setState] = useState({
    page: 0
  });

  const handlePageBack = () => {
    const page = state.page - 1 > 0 ? state.page - 1 : 0;
    setState({page: page});
  }

  const handlePageForward = () => {
    const page = state.page + 1 < pageCount - 1 ? state.page + 1 : pageCount - 1;
    setState({page: page});
  }

  const start = pageSize * state.page + 1;
  const end = start + pageSize;
  const allLocations = conc[params.word];
  const locations = allLocations.slice(start, end);

  // pretty-print nice bible verse citations
  const displayLocations = locations.map((location, idx) => {
    return toc[location[1]] + " " + location[2] + ":" + location[3];
  });

  // highlight occurences of the word in the text
  const displayText = locations.map((location, idx) => {
    const text = bible[location[0]];
    const highlights = text.toLowerCase().replace(ggpunctuationregex, "").split(' ').map((t) => {
      if (t == params.word){
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
      <div className="back-button"> <Link to="/concordance/search"><img src={backArrow} 
        alt="back" height="15" width="15"/><span className="back-text"> back</span></Link></div>
      <div className="active-word">
        {params.word} 
      </div>
      <VerseGraph />
      <div className="occurences">({count} occurences)</div>
      <div className="page-buttons">
        { state.page > 0 && <span className="back-button" onClick={handlePageBack}>&lt; page back</span> }
        { state.page < pageCount - 1 && <span className="forward-button" onClick={handlePageForward}>page forward &gt;</span> }
      </div>
      {locations.map( (location, idx) => {
        return (
          <Verse key={displayLocations[idx]+idx} index={displayLocations[idx]} text={displayText[idx]} />  
        )
      })}
    </div>
  )

}


const VerseGraph = () => {

  const params = useParams();
  const allLocations = conc[params.word];

  let count = {};
  for (let i = 1; i < labels.length + 1; i++) {
    count[i] = 0;
  }

  const res = allLocations.map((loc) => {return loc[1]}).forEach((loc) => {count[loc] += 1;});

  const data = {
    labels,
    datasets: [
      {
        label: "",
        data: Object.values(count),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  const options = {
    responsive: true,
    options: {
      scales: {
        xAxes: [{
          ticks: {
            fontSize: 12
          }
        }]
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <Bar options={options} data={data} />
  )
}


function Verse({index, text}) {

  return ( 
    <div className="verse-container">
      <div className="verse-title">
        {index}
      </div>
      <div className="verse-text" dangerouslySetInnerHTML={{__html: '<span>' + text + '</span>'}}>
      </div>
    </div>
    )
}

export default VerseDisplay;
