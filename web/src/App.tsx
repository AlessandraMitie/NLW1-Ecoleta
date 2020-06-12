//import React, { useState } from 'react';
import React from 'react';
import './App.css';

//import Header from './Header';
//import Home from './pages/Home';
import Routes from './routes';

function App() {
  //return React.createElement('h1', {
  //  children: 'Hello World'
  //});

  //const [counter, setCounter] = useState(0); //[valor do estado, função para atualizar o valor do estado]
  //função useState sempre retorna um array. Na primeira posição desse array, tem o valor do estado, a segunda posição é uma função para atualizar o valor do estado]

  //function handleButtonClick() {
    //counter++;
    //console.log(counter);
    //setCounter(counter + 1);
  //}

  return (
    //<div>
       //{/* Componente Header */}
      //<Header title="Hello World" />

      //<h1>{counter}</h1>
      //<button type="button" onClick={handleButtonClick}>Aumentar</button>
    //</div>
    <Routes />
  );
}

export default App;