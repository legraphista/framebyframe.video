function parseVideo(video) {
  return {
    fps: parseFloat(video.Frame_rate[0])
  }
}

export function parseData(data) {
  const video = parseVideo(data.File.track.find(t => t.$.type.toLowerCase() === 'video'));

  return {
    video
  };
}