import { Provider, Subscribe, Container } from 'unstated';
import React from 'react';

// this state management solution is based on post in https://hmh.engineering/the-unstated-react-service-pattern-786ea6168d1d

interface DimmedState {
	isDimmed:boolean;
}

export class DimmedContainer extends Container<DimmedState> {
	constructor() {
		super();
		this.state = {
			isDimmed:true
		};
	}

	public showDim() {
		this.setState({isDimmed:true});
	}
	public hideDim() {
		this.setState({isDimmed:false});
	}
}

// Following the Singleton Service pattern (think Angular Service),
// we will instantiate the Container from within this module
const DimmedState = new DimmedContainer();

// Then we will wrap the provider and subscriber inside of functional
// React components. This simplifies the resuse of the module as we
// will be able to import this module as a depenency without having
// to import Unstated and/or create React Contexts  manually in the
// places that we want to Provide/Subscribe to the API Service.
export const DimmedStateProvider = props => {
	// We leave the injector flexible, so you can inject a new dependency
	// at any time, eg: snapshot testing
	return <Provider inject={props.inject || [DimmedState]}>{props.children}</Provider>;
};

export const DimmedStateSubscribe = props => {
	// We also leave the subscribe "to" flexible, so you can have full
	// control over your subscripton from outside of the module
	return <Subscribe to={ props.to || [DimmedState]} >{props.children}</Subscribe>;
};


export default DimmedState;