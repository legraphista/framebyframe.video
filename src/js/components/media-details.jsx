import React from 'react';
import {observer} from 'mobx-react';
import {hot} from 'react-hot-loader';
import {FileStore} from '../store';
import {parseAsCulomnData} from '../parse/text-list';

class Item extends React.Component {
  render() {
    const { item } = this.props;

    const list = item.list.map(([name, data], i) => <li key={i}>{name}: {data}</li>)

    return (
      <div>
        <h2>{item.type}</h2>
        <ul>
          {list}
        </ul>
      </div>
    )
  }
}

@observer
class MediaDetails extends React.Component {
  render() {
    if(!FileStore.data){
      return <div>?????</div>
    }

    const data = parseAsCulomnData(FileStore.data);

    const entries = data.map((e, i) => <Item key={i} item={e} />);

    return (
      <div>
        {entries}
      </div>
    )
  }
}

export default hot(module)(MediaDetails)
