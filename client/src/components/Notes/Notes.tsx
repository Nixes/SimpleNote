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
	private readonly pixelBufferFetch = 200;
	constructor(props) {
		super(props);
		this.state={currentlyEditingId:null};

		this.props.notesContainer.getNewPage();
		window.onscroll = this.checkScroll;
	}


	checkScroll = () => {
		// compatability boilerplate
		const body = document.body;
		const html = document.documentElement;
		const documentHeight = Math.max( body.scrollHeight, body.offsetHeight,
			html.clientHeight, html.scrollHeight, html.offsetHeight );

		if ((window.innerHeight + this.pixelBufferFetch) > documentHeight) {
			// simple blocking system, prevents notes from loading in wrong order
			// TODO: FIX. This may have issues when scrolling too fast, we may need some kind of queuing system
			console.log("A page was requested during filling");
			this.props.notesContainer.getNewPage();
		}
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

	// TODO: this should eventually be replaced with an MD format parser
	generateHTML = (noteContent:string) => {
		// linkify note content
		// http://, https://, ftp://
		const urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

		// www. sans http:// or https://
		const pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

		// Email addresses
		const emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;
		// from https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
		let tmp = noteContent
			.replace(urlPattern, '<a href="$&">$&</a>')
			.replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
			.replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
		tmp = tmp.replace(/[\n\r]/g, '<br />'); // converts newlines to standard html line breaks

		return tmp;
	}

	note = (note:Note) => {
		const isBeingEdited = (this.state.currentlyEditingId === note.id);
		return 	(
			<div className="note" key={note.id.toString()} data-note-id={note.id.toString()}>
				{isBeingEdited ?
					<div className="notecontent" contentEditable={true} style={{zIndex:100}}>
						{this.generateHTML(note.content)}
					</div>
						:
					<div className="notecontent">
						{this.generateHTML(note.content)}
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
