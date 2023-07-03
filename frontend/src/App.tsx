import React from 'react';
import './App.css';
import HttpHandler from './components/HttpHandler';
import Routes from './routes/Routers';

function App() {

  return (
    <div className="App">
      <HttpHandler/>
      <Routes/>
    </div>
  );
}

export default App;
