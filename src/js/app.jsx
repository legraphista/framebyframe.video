import React from "react";
import {hot} from "react-hot-loader";
import {observer} from 'mobx-react';
import ReactTooltip from 'react-tooltip'
import {FileStore} from './store';
import '../css/index.css'
import MediaShow from './components/media-view';

@observer
class App extends React.Component {

  render() {

    const hasFile = !!FileStore.file;
    const isProcessing = FileStore.processing;
    const data = FileStore.data;

    let child = null;
    if (hasFile) {

      if (isProcessing) {
        child = <div className={"processing big"}> Processing </div>
      } else {
        child = <MediaShow/>
      }
    }

    return (
      <div className={"app"}>

        <label className={`custom-file-upload ${child ? "" : "big"}`}>
          <input type={'file'} accept={"video/*"} onChange={e => FileStore.setFile(e.target.files[0])}/>
          Select Video
        </label>
        {child}

        <ReactTooltip className={"tooltip-extra"}/>
      </div>
    )
  }
}

export default hot(module)(App)
