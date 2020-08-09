import MyReact from '../lib/MyReact'
import Component from './Component';
export default class Square extends Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <button className="square" onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}