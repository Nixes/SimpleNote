import { Provider, Subscribe, Container } from 'unstated';
import React from 'react';
import {Note} from "../types/note";

const API_ROOT = "http://localhost:8080/api.php";

// this state management solution is based on post in https://hmh.engineering/the-unstated-react-service-pattern-786ea6168d1d

interface NotesState {
	lastNoteId:number, // this should be removed once this is reconnected to its correct api
	currentPage: number,
	notes: Map<number,Note>;
}

export class NotesContainer extends Container<NotesState> {
	constructor() {
		super();
		this.state = {
			lastNoteId:0,
			currentPage: 0,
			notes: new Map()
		};
	}

	public getPage = () => {

	}

	public addNote = async (noteContent) => {
			// const apiUrl = "noteQuery.php";
			// const body = "notesRequest_Type=add&note=" + noteContent;
			//
			// // replace old code with new fetch syntax
			// const response = await fetch(apiUrl,{
			// 	method:"POST",
			// 	headers: [["Content-type","application/x-www-form-urlencoded"]],
			// 	body:body
			// });
			// console.log("Add note API result: ");
			// console.log(response.json());
		const options = {
				mode: "cors",
				method:"PUT",
				body:JSON.stringify({
					content: noteContent}),
				headers: {
					"Content-Type": "application/json"
				}
		};
		try {
			// @ts-ignore
			const result = await fetch(API_ROOT+'/notes',options);
			console.log("Addnote response: ");
			console.log(result);
		} catch (e) {
			console.error(e);
		}
		console.log(options);

		let nextId = this.state.lastNoteId+1;
		const note:Note = {
			id:nextId,
			content:noteContent
		};
		const previousState = this.state;
		previousState.lastNoteId = nextId;
		this.setState(previousState);
		this.stateAddNote(note);
	}

	public removeNote = async (id:number) => {
		this.stateRemoveNote(id);
	}

	public stateAddNotes = (newNotes:Note[]) => {
		const notes = this.state.notes;

		for (const note of newNotes) {
			notes.set(note.id,note);
		}

		this.setState({ notes: notes});
	}

	private stateAddNote = (newNote:Note) => {
		const notes = this.state.notes;
		notes.set(newNote.id,newNote);

		this.setState({ notes: notes});
	}

	public stateRemoveNote = (id:number) => {
		const notes = this.state.notes;
		notes.delete(id);

		this.setState({ notes: notes});
	}

	public stateUpdateNote = (id:number) => {
		const notes = this.state.notes;
		notes.delete(id);

		this.setState({ notes: notes});
	}
}

// Following the Singleton Service pattern (think Angular Service),
// we will instantiate the Container from within this module
const DimmedState = new NotesContainer();

// Then we will wrap the provider and subscriber inside of functional
// React components. This simplifies the resuse of the module as we
// will be able to import this module as a depenency without having
// to import Unstated and/or create React Contexts  manually in the
// places that we want to Provide/Subscribe to the API Service.
export const NotesStateProvider = props => {
	// We leave the injector flexible, so you can inject a new dependency
	// at any time, eg: snapshot testing
	return <Provider inject={props.inject || [DimmedState]}>{props.children}</Provider>;
};

export const NotesStateSubscribe = props => {
	// We also leave the subscribe "to" flexible, so you can have full
	// control over your subscripton from outside of the module
	return <Subscribe to={ props.to || [DimmedState]} >{props.children}</Subscribe>;
};


export default NotesContainer;