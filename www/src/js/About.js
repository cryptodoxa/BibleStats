import React from 'react';
import "../css/About.css";


const About = () => {

  return (
    <div className='about'>
      <p>Nifty Bible Stats is a project with two purposes: 1) for me to learn react and 2) for me to experiment with
        opinions I have for building web apps. </p>
      <p>You will notice that Nifty Bible Stats takes awhile to load, and after that 
        it has no loading time. This is because it is a completely client-side data-explorer app, self-contained with no 
        need to make calls to additional web APIs. Once it is loaded, it is complete. In the future, the data will be cached
        locally so that the app only has to be loaded once, ever. </p>
    </div>
  )
}

export default About;