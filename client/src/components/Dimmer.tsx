import React, { Component } from 'react';

export interface DimmerProps {
    //hideDim:any,
    isDimmed:boolean
}

class Dimmer extends Component<DimmerProps> {
    render() {
        //onClick={this.props.hideDim()}
        return (
            <div id="dim" className={this.props.isDimmed ? "visible" : "hidden"}></div>
        );
    }
}

export default Dimmer;
