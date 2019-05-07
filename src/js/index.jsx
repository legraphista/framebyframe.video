/**
 Copyright Findie 2019
 Author: Stefan
 File: index.jsx
 */
import {parseFile} from "./mediainfo";
import {parseData} from "./data-parsing";

import {inspect} from 'util'

const inputFileEle = document.getElementById('file');
const preEle = document.getElementById('log');

function log(text) {
  preEle.innerHTML += text + '\n';
}

inputFileEle.addEventListener('change', async event => {
  const file = event.target.files[0];

  log(`Analyzing ${file.name}\n______`);
  try {
    const data = await parseFile(file);

    const prettyJson = inspect(data, {depth: Infinity, breakLength: 120});
    try {
      log(`Parsed: ${inspect(parseData(data))}`);
    }catch (e) {
      log(e.stack);
    }
    log(`Data: ${prettyJson}`);

    console.log(prettyJson);
    console.log(data);
    console.log(parseData(data));
  } catch (e) {
    log(e.stack || e.toString());
  }
});
