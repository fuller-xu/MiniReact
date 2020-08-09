import MyReact from '../lib/MyReact'
import Component from './Component';

export default class CustomComponent extends Component {
  render () {
    return <div>
      <span>
        hello world
      </span>
      <div>
        {this.children}
      </div>
      {true}
    </div>
  }
}