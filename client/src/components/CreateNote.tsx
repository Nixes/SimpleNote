import React, {Component, PureComponent} from 'react';
import Masonry from 'react-masonry-component';
import {Subscribe} from "unstated";
import {DimmedContainer} from "../state/DimmedContainer";

interface CreateNoteProps {
	showDim:Function;
	hideDim:Function;
	addNote:Function;
}

class CreateNote extends Component<CreateNoteProps> {
	constructor(props) {
		super(props);
	}

  addNewNote = (e) => {
	  let noteContentElem = document.getElementById("noteContent")  as HTMLInputElement;
	  if (noteContentElem) {
		  let noteContent = noteContentElem.value;
		  // add to local state and send to server
		  this.props.addNote(noteContent);
	  }
  }

  hideAddNote = (evt:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.props.hideDim();

    // remove focus from note content form
    let noteContentElement = document.getElementById("noteContent");
    if (noteContentElement) {
      noteContentElement.blur();
    }
    // hide note content form
    let addNoteElement = document.getElementById("add_note");
    if (addNoteElement) {
      addNoteElement.style.display = "none";
    }
  }

  showAddNote = () => {
    this.props.showDim();
    let addNoteElement = document.getElementById("add_note");
    let noteContentElem = document.getElementById("noteContent");
    if (addNoteElement) {
		addNoteElement.style.display = "block";
		if (noteContentElem) {
			noteContentElem.focus();
		}
	}
  }

  render() {
    return (

			<div id="createNoteComponent">
			  <div id="add_note">
				<div>
				  <textarea rows={1} id="noteContent"></textarea>
				  <button onClick={this.addNewNote} type="submit">add</button>
				  <button type="reset" id="cancel" onClick={this.hideAddNote}>cancel</button>
				</div>
			  </div>
			  <button id = "addnotebutton" onClick = {this.showAddNote} > addnote </button>
			</div>
    );
  }
}

export default CreateNote;
