import React, {Component, PureComponent} from 'react';
import './App.css';
import CreateNote from "./components/CreateNote";
import Dimmer from "./components/Dimmer/Dimmer";
import { Subscribe } from 'unstated'
import {DimmedContainer, DimmedStateSubscribe} from "./state/DimmedContainer";
import Notes from "./components/Notes/Notes";
import NotesContainer, {NotesStateSubscribe} from "./state/NotesContainer";

class NoteApp extends Component {
  render() {
    return (
      <div id="app">
        <div id="container">
			<Subscribe to={[DimmedContainer,NotesContainer]}>{(dimmedStateUnstated: any, notesContainer: any) =>
					<CreateNote showDim={dimmedStateUnstated.showDim} hideDim={dimmedStateUnstated.hideDim} addNote={notesContainer.addNote}/>
			}</Subscribe>

			<NotesStateSubscribe>{(notesContainer: any) =>
				<Notes notesContainer={notesContainer}/>
			}</NotesStateSubscribe>
        </div>
		<Dimmer/>
      </div>
    );
  }
}

export default NoteApp;
