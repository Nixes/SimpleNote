import React, { Component } from 'react';
import './App.css';
import CreateNote from "./components/CreateNote";
import Dimmer from "./components/Dimmer/Dimmer";
import { Subscribe } from 'unstated'
import {DimmedContainer, DimmedStateSubscribe} from "./state/DimmedContainer";
import Notes from "./components/Notes/Notes";

class NoteApp extends Component {
  render() {
    return (
      <div id="app">
        <div id="container">
			<DimmedStateSubscribe>{(dimmedStateUnstated: any) =>
					<CreateNote showDim={dimmedStateUnstated.showDim} hideDim={dimmedStateUnstated.hideDim}/>
			}</DimmedStateSubscribe>

          <div id="notes">
          </div>
		{/*<Notes/>*/}

        </div>
		  <DimmedStateSubscribe>{(dimmedStateUnstated:any) =>
		  				<button onClick={dimmedStateUnstated.showDim}>Dimm everything</button>}
		  </DimmedStateSubscribe>
		<Dimmer/>
      </div>
    );
  }
}

export default NoteApp;
