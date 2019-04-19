import React, { Component } from 'react';
import {Subscribe} from "unstated";
import {DimmedContainer} from "../../state/DimmedContainer";
import './Dimmer.css';

class Dimmer extends Component {
    render() {
        return (
			<Subscribe to={[DimmedContainer]}>
				{(dimmedStateUnstated:any) => (
					<div id="dim" onClick={dimmedStateUnstated.hideDim} className={dimmedStateUnstated.state.isDimmed ? "visible" : "hidden"}></div>
				)}
			</Subscribe>
        );
    }
}

export default Dimmer;
