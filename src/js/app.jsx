import React from "react";
import {hot} from "react-hot-loader";
import {observer} from 'mobx-react';
import ReactTooltip from 'react-tooltip'
import DropZone from 'react-drop-zone'
import {FileStore} from './store';
import 'react-drop-zone/dist/styles.css'
import '../css/index.css'
import {parseAsCulomnData} from './parse/text-list';
import {toJS} from 'mobx';
import MediaDetails from './components/media-details';

@observer
class App extends React.Component {

  render() {

    const hasFile = !!FileStore.file;
    const isProcessing = FileStore.processing;
    const data = FileStore.data;

    return (
      <div>

        <DropZone onDrop={FileStore.setFile}>
          {

            ({ over, overDocument }) => {

              if (over) {
                return <div className="DropZone DropZone--over"> Drop the file </div>
              }

              if (overDocument) {
                return <div className="DropZone DropZone--over-document"> Drop the file here </div>
              }

              if (hasFile) {

                if (isProcessing) {
                  return <div> processing </div>
                } else {
                  return <MediaDetails/>
                }
              }

              return <div className="DropZone">Drop a file to start (or click here)</div>
            }
          }
        </DropZone>

        <ReactTooltip className={"tooltip-extra"} />
      </div>
    )
  }
}

export default hot(module)(App)
