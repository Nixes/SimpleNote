import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import NoteApp from "./NoteApp";
import {DimmedStateProvider} from "./state/DimmedContainer";
import {NotesStateProvider} from "./state/NotesContainer";

ReactDOM.render(<DimmedStateProvider><NotesStateProvider><NoteApp /></NotesStateProvider> </DimmedStateProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
