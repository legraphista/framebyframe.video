let miLib;
const CHUNK_SIZE = 1024 * 1024;

const { parseString } = require('xml2js');

export async function getMediaInfoLib() {

  if (miLib) {
    return new miLib.MediaInfo();
  }

  while (!MediaInfoLib) {
    await new Promise(_ => setTimeout(_, 100));
  }

  window.miLib = miLib = MediaInfoLib({
    wasmBinaryFile: 'js/MediaInfoWasm-19.04.wasm'
  });

  while (!miLib.MediaInfo) {
    await new Promise(_ => setTimeout(_, 100));
  }

  return new miLib.MediaInfo();
}

export async function parseFile(file, mi) {

  console.log('parsing', file);
  if (!mi) {
    mi = await getMediaInfoLib();
  }
  mi.Option('Complete', '1');
  mi.Option('Output', 'JSON');
  mi.Option('Inform', 'JSON');

  await new Promise(_ => mi.Open(file, _));

  const data = mi.Inform();
  console.log('done parsing', file, JSON.parse(data));

  return JSON.parse(data);
}

export function findVideoInData(data) {
  const { media } = data;
  if (!media) return null;

  const { track } = media;
  if (!track) return null;

  return track.find(t => t["@type"] === 'Video')
}

export function isFileVideo(data) {
  return !!findVideoInData(data);
}

