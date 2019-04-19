import React, { Component } from 'react';
import {Subscribe} from "unstated";
import {DimmedContainer} from "../state/DimmedContainer";

export interface DimmerProps {
    //hideDim:any,
    isDimmed:boolean
}

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
