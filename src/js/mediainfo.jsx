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
  if (!mi) {
    mi = await getMediaInfoLib();
  }
  mi.Option('Complete', '1');
  mi.Option('Output', 'JSON');
  mi.Option('Inform', 'JSON');

  await new Promise(_ => mi.Open(file, _));

  const data = mi.Inform();
  return JSON.parse(data);
}
