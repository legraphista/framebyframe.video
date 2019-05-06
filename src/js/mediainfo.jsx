let miLib;
const CHUNK_SIZE = 5 * 1024 * 1024;

const {parseString} = require('xml2js');


export async function getMediaInfoLib() {

  if (miLib) {
    return new miLib.MediaInfo();
  }

  while (!MediaInfo) {
    await new Promise(_ => setTimeout(_, 100));
  }

  return new Promise(_ => {

    miLib = MediaInfo(function () {
      console.debug('MediaInfo ready');
      window['miLib'] = miLib; // debug
      _(new miLib.MediaInfo());
    });
  });
}

async function readFileChunk(file, offset, length) {
  var r = new FileReader();
  var blob = file.slice(offset, length + offset);
  const reloadEvent = new Promise(_ => r.onload = _);
  r.readAsArrayBuffer(blob);

  const event = await reloadEvent;
  if (event.target.error) {
    throw event.target.error;
  }

  return new Uint8Array(event.target.result);
}

async function parseXML(xml) {
  return new Promise((res, rej) => parseString(xml, function (err, result) {
      if (err) {
        return rej(err);
      }
      return res(result);
    })
  )
}

export async function parseFile(file, mi) {
  if (!mi) {
    mi = await getMediaInfoLib();
  }
  const fileSize = file.size;
  let offset = 0;
  let seekTo = -1;
  let lastChunkSize = CHUNK_SIZE;
  mi.open_buffer_init(fileSize, offset);

  while (true) {
    const chunk = await readFileChunk(file, offset, lastChunkSize);
    lastChunkSize = chunk.length;
    const state = mi.open_buffer_continue(chunk, chunk.length);

    const seekToLow = mi.open_buffer_continue_goto_get_lower();
    const seekToHigh = mi.open_buffer_continue_goto_get_upper();

    if (seekToLow === -1 && seekToHigh === -1) {
      seekTo = -1;
    } else if (seekToLow < 0) {
      seekTo = seekToLow + 2 ** 32 + (seekToHigh * 2 ** 32);
    } else {
      seekTo = seekToLow + (seekToHigh * 2 ** 32);
    }

    if (seekTo === -1) {
      offset += chunk.length;
    } else {
      offset = seekTo;
      mi.open_buffer_init(fileSize, seekTo);
    }

    if (state & 0x08) {
      const result = mi.inform();
      mi.close();
      return {
        data: await parseXML(result),
        xml: result
      };
    }
  }
}