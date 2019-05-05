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

type APINote = { id: string, content: string };

class NoteAPI {
	static async addNote(noteContent: string):Promise<APINote> {
		const options = {
			mode: "cors",
			method:"PUT",
			body:JSON.stringify({
				content: noteContent}),
			headers: {
				"Content-Type": "application/json"
			}
		};
		// @ts-ignore
		const result = await fetch(API_ROOT + '/notes', options);
		const addedNote: APINote = await result.json();
		return addedNote;
	}

	static async removeNote(noteId: number):Promise<void> {
		const options = {
			mode: "cors",
			method:"DELETE"
		};
		// @ts-ignore
		const result = await fetch(API_ROOT + '/notes/'+noteId, options);
		const response = await result.json();
		return;
	}

	static async getPage(pageNumber: number):Promise<APINote[]> {
		const pageSize = 20;
		const options = {
			mode: "cors",
			method:"GET"
		};
		// @ts-ignore
		const result = await fetch(API_ROOT + `/notes?pageSize=${pageSize}&page=${pageNumber}`, options);
		const response = await result.json();
		return response;
	}
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

	public getNewPage = async () => {
		const nextPage = this.state.currentPage + 1;
		const apiNotes = await NoteAPI.getPage(nextPage);
		const notes = apiNotes.map((apiNote)=>{
			return {id: parseInt(apiNote.id), content: apiNote.content};
		});
		this.stateGetPage(notes);

		// update page number
		const state = this.state;
		state.currentPage = nextPage;
		this.setState(state);
	};

	public addNote = async (noteContent) => {
		try {
			const addedNote = await NoteAPI.addNote(noteContent);
			const noteId = parseInt(addedNote.id);

			const note:Note = {
				id:noteId,
				content:noteContent
			};
			const previousState = this.state;
			this.setState(previousState);
			this.stateAddNote(note);
		} catch (e) {
			console.error(e);
		}
	}

	public removeNote = async (id:number) => {
		try {
			NoteAPI.removeNote(id);
			this.stateRemoveNote(id);
		}catch (e) {
			console.error(e);
		}
	}

	public stateAddNotes = (newNotes:Note[]) => {
		const notes = this.state.notes;

		for (const note of newNotes) {
			notes.set(note.id,note);
		}

		this.setState({ notes: notes});
	}

	private stateGetPage = (pageNotes: Note[]) => {
		this.stateAddNotes(pageNotes);
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
