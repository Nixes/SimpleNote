import React, { Component } from 'react';
import './App.css';
import Masonry from 'react-masonry-component';
import CreateNote from "./components/CreateNote";
import Dimmer from "./components/Dimmer";
import { Provider, Subscribe, Container } from 'unstated';

interface NoteAppState {
  isDimmed:boolean;
}

class NoteAppGlobalState extends Container<NoteAppState> {
  state = {
    isDimmed:false
  };

  showDim() {
    this.setState({isDimmed:true});
  }
  hideDim() {
    this.setState({isDimmed:false});
  }
}

let noteAppGlobalState = new NoteAppGlobalState();

const masonryOptions = {
  transitionDuration: 0,
  gutter: 10,
  itemSelector: '.note',
  columnWidth: 200
};

class NoteApp extends Component<NoteAppState,NoteAppState> {
  render() {
    return (
      <div id="app">
        <div id="container">
          <CreateNote/>

          <div id="notes">
          </div>
          // div above is now redundant, but I still need to change the rest of the code to use
          // the new class name instead of id
          <Masonry className="notes" options={masonryOptions}/>


        </div>
        <Dimmer isDimmed={this.state.isDimmed}></Dimmer>
      </div>
    );
  }
}

export default NoteApp;
