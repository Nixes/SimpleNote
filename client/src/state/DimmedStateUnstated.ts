import { Provider, Subscribe, Container } from 'unstated';


interface DimmedState {
	isDimmed:boolean;
}

class DimmedStateUnstated extends Container<DimmedState> {
  state = {
    isDimmed:false
  };

  showDim() {
    this.setState({isDimmed:true});
  }
  hideDim() {
    this.setState({isDimmed:false});
  }
}

export {DimmedStateUnstated};