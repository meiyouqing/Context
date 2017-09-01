import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import './App.css'
import Context from './Context'
import Detail from './Detail'

class App extends Component {
  handlePoint = (e) => {console.log(e);e.stopPropagation();console.log(e)}
    unBindEvent = () => {
        this.whellEvent = document.body.onwheel = document.body.onmousewheel;
        this.mouseDown = document.body.onmousedown;
        document.body.onwheel = document.body.onmousewheel = null;
        document.body.onmousedown = null;
    }
    bindEvent = () => {
        document.body.onwheel = document.body.onmousewheel = this.whellEvent;
        document.body.onmousedown = this.mouseDown;
    }
  render() {
    console.log('APP')
    return (
      <div className="App">
        <Context handlePoint={this.handlePoint} />
        <Route
          path="/detail/**"
          render={({location, history}) => (
            <Detail
            location={location}
            history={history}
            bindEvent={this.bindEvent}
            unBindEvent={this.unBindEvent}
            />)
          }
        />
      </div>
    );
  }
}

export default App;
