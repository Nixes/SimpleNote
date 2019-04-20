import React, {Component, PureComponent} from 'react';
import Masonry, {MasonryOptions} from 'react-masonry-component';
import {Note} from "../../types/note";
import NotesContainer from "../../state/NotesContainer";

const masonryOptions:MasonryOptions = {
	transitionDuration: 100,
	gutter: 10,
	itemSelector: '.note',
	columnWidth: 200
};

interface NotesProps {
	notesContainer:NotesContainer,
}

interface NotesState {
	currentlyEditingId: number|null,
}

class Notes extends Component<NotesProps,NotesState> {
	constructor(props) {
		super(props);
		this.state={currentlyEditingId:null};
	}

	activateEditMode(id:number) {
		this.setState({currentlyEditingId:id})
	}
	cancelEditMode() {
		this.setState({currentlyEditingId: null});
	}

	editNote = (e) => {
		const noteId = e.target.parentNode.parentNode.dataset.noteId;
		console.log("Edit button clicked from note: "+noteId);
		// notes.enableEdit(e.target.parentNode.parentNode);
		this.activateEditMode(parseInt(noteId));
	}
	cancelEditNote = (e) => {
		const noteId = e.target.parentNode.parentNode.dataset.noteId;
		console.log("Cancel button pressed: "+noteId);
		this.cancelEditMode();
		// notes.cancel(e.target.parentNode.parentNode);
	}

	deleteNote = (e) => {
		const noteId = e.target.parentNode.parentNode.dataset.noteId;
		console.log("Delete button clicked from note: "+noteId);

		if (confirm("Remove note?")) {
			console.log("Removing note");
			this.props.notesContainer.removeNote(parseInt(noteId));
		}
		// notes.remove(e.target.parentNode.parentNode);
	}

	saveNote = (e) => {
		const noteId = e.target.parentNode.parentNode.dataset.noteId;
		console.log("Save button pressed: "+noteId);
		// notes.save(e.target.parentNode.parentNode);
	}

	note = (note:Note) => {
		const isBeingEdited = (this.state.currentlyEditingId === note.id);
		return 	(
			<div className="note" key={note.id.toString()} data-note-id={note.id.toString()}>
				{isBeingEdited ?
					<div className="notecontent" contentEditable={true} style={{zIndex:100}}>
						{note.content}
					</div>
						:
					<div className="notecontent">
						{note.content}
					</div>}

				{ isBeingEdited ? (
					<div className="buttonbar editbar">
						<button className="save" onClick={this.saveNote}>save</button>
						<button className="cancel" onClick={this.cancelEditNote}>cancel</button>
						<div className="clearfloat"></div>
					</div>
				) : (
					<div className="buttonbar">
						<button className="edit" onClick={this.editNote}>edit</button>
						<button className="delete" onClick={this.deleteNote}>del</button>
						<div className="clearfloat"></div>
					</div>
				) }
			</div>
		);
	}

	notes = () => {
		let results:any[] = [];
		for(const map of this.props.notesContainer.state.notes) {
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
				{this.notes()}
			</Masonry>
        );
    }
}

export default Notes;
