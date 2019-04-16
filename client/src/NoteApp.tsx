import React, { Component } from 'react';
import './App.css';
import Masonry from 'react-masonry-component';
import CreateNote from "./components/CreateNote";
import Dimmer from "./components/Dimmer";
import { Subscribe } from 'unstated'
import {DimmedStateUnstated} from "./state/DimmedStateUnstated";

const masonryOptions = {
  transitionDuration: 0,
  gutter: 10,
  itemSelector: '.note',
  columnWidth: 200
};

class NoteApp extends Component {
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
		  <Subscribe to={[DimmedStateUnstated]}>
			  {(dimmedStateUnstated:any) =>
       			 <Dimmer isDimmed={dimmedStateUnstated.state.isDimmed}></Dimmer>
			  }
		  </Subscribe>
      </div>
    );
  }
}

export default NoteApp;
