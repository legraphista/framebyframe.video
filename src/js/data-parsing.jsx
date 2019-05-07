function parseVideo(video) {
  return {
    fps: parseFloat(video.FrameRate)
  }
}

export function parseData(data) {
  const video = parseVideo(data.media.track.find(t => t['@type'].toLowerCase() === 'video'));

  return {
    video
  };
}
