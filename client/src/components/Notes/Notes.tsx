import React, { Component } from 'react';
import Masonry from 'react-masonry-component';
import './Dimmer.css';
import {Note} from "../../types/note";
import NotesContainer from "../../state/NotesContainer";

const masonryOptions = {
	transitionDuration: 0,
	gutter: 10,
	itemSelector: '.note',
	columnWidth: 200
};

interface NotesState {
	editMode:boolean,
	notesContainer:NotesContainer,
	notes:Map<number,Note>
}

class Notes extends Component<NotesState> {
	editNote = (e) => {
		console.log("Edit button clicked from note: "+e.target.parentNode.parentNode.getAttribute('id'));
		// notes.enableEdit(e.target.parentNode.parentNode);
	}
	cancelEditNote = (e) => {
		console.log("Cancel button pressed: "+e.target.parentNode.parentNode.getAttribute('id'));
		// notes.cancel(e.target.parentNode.parentNode);
	}

	deleteNote = (e) => {
		console.log("Delete button clicked from note: "+e.target.parentNode.parentNode.getAttribute('id'));
		// notes.remove(e.target.parentNode.parentNode);
	}

	saveNote = (e) => {
		console.log("Save button pressed: "+e.target.parentNode.parentNode.getAttribute('id'));
		// notes.save(e.target.parentNode.parentNode);
	}

	note = (note:Note) => {
		return 	(
			<div className="note" id={note.id.toString()}>
				<div className="notecontent">{note.content}</div>
				<div className="buttonbar">
					<button className="edit" onClick={this.editNote}>edit</button>
					<button className="delete" onClick={this.deleteNote}>del</button>
					<div className="clearfloat"></div>
				</div>
				<div className="buttonbar editbar">
					<button className="save" onClick={this.saveNote}>save</button>
					<button className="cancel" onClick={this.cancelEditNote}>cancel</button>
					<div className="clearfloat"></div>
				</div>
			</div>
		);
	}

	notes = () => {
		let results:any[] = [];
		for(const map of this.props.notes) {
			const [key,note] = map;

			results.push(this.note(note));
		}
		return results;
	}

    render() {
        return (
			// div above is now redundant, but I still need to change the rest of the code to use
			// the new class name instead of id
			<Masonry className="notes" options={masonryOptions}>
				{this.notes}
			</Masonry>
        );
    }
}

export default Notes;
