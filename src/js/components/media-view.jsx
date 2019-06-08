import React from 'react';
import {observer} from 'mobx-react';
import {hot} from 'react-hot-loader';
import {FileStore} from '../store';
import '../../css/media-view.css';
import {findVideoInData} from "../mediainfo";

function findVideoFPS(data) {
  const video = findVideoInData(data);
  if (!video) {
    console.trace('cannot find video for', data);
    return 60;
  }

  const fps = video.FrameRate;
  if (!fps) {
    console.trace('cannot find fps for', video);
    return 60;
  }

  return fps;
}

@observer
class MediaShow extends React.Component {

  state = {
    time: 0,
    fps: 0,
    origin: 0
  };

  videoRef = React.createRef();
  changeBy = 0;

  componentDidMount() {
    this.mountVideo();

    window.addEventListener('keydown', this.handleKey);

  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKey);
  }

  adjustTime = (by) => {
    const time = this.state.time;
    const adjusted = time + by;

    const clamped = Math.round(adjusted * this.state.fps) / this.state.fps;

    this.videoRef.current.currentTime = clamped;
    this.setState({
      ...this.state,
      time: clamped
    })
  };

  handleKey = (event) => {
    const video = this.videoRef.current;
    if (event.key === 'ArrowRight') {
      this.adjustTime(+this.changeBy);
    }
    if (event.key === 'ArrowLeft') {
      this.adjustTime(-this.changeBy);
    }
    if (event.key === ' ') {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
    this.videoRef.current.blur();
    console.log(event.key);

  };

  mountVideo = () => {
    this.videoRef.current.src = URL.createObjectURL(FileStore.file);
    const fps = findVideoFPS(FileStore.data);
    this.changeBy = 1 / fps;
    this.setState({
      ...this.state,
      fps,
      origin: 0
    });

    let permitOneTimeUpdate = false;

    this.videoRef.current.addEventListener('click', e => e.target.blur());
    this.videoRef.current.addEventListener('seeking', () => {
      permitOneTimeUpdate = true
    });
    this.videoRef.current.addEventListener("timeupdate", () => {
      if (this.videoRef.current.paused && !permitOneTimeUpdate) {
        return;
      }

      permitOneTimeUpdate = false;

      this.setState({
        ...this.state,
        time: this.videoRef.current.currentTime
      })
    });
  };

  setOrigin = (e) => {
    e.target.blur();
    this.setState({
      ...this.state,
      origin: this.videoRef.current.currentTime
    })
  };

  componentWillReceiveProps(nextProps, nextContext) {
    this.mountVideo();
  }

  render() {
    if (!FileStore.data) {
      return null;
    }

    const deltaTimeFromOrigin = this.videoRef.current ?
      this.videoRef.current.currentTime - this.state.origin :
      0;

    return (
      <div className={"video-container"}>

        <video ref={this.videoRef} controls={true}>
        </video>
        <div className={'sub-video'}>
          <div className={'stats'}>
            <div>FPS: {(1 / this.changeBy).toFixed(3)}</div>
            <div>Current Time {this.state.time.toFixed(3)}</div>
          </div>
          <div>
            <button onClick={this.setOrigin}>Set Origin</button>
            <div>Origin: {this.state.origin.toFixed(3)}</div>
            <div>Distance in frames: {(deltaTimeFromOrigin * this.state.fps).toFixed(0)}</div>
            <div>Distance in time: {deltaTimeFromOrigin.toFixed(3)}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default hot(module)(MediaShow)
