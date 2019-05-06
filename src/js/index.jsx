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

inputFileEle.addEventListener('change', async event => {
  const file = event.target.files[0];

  preEle.innerHTML += `Analyzing ${file.name}\n______\n`;
  const {data, xml} = await parseFile(file);

  const prettyJson = inspect(data, {depth: Infinity, breakLength: 120});
  preEle.innerHTML += `Data: ${prettyJson}\n`;

  console.log(prettyJson);
  console.log(data);
  console.log(parseData(data));
});