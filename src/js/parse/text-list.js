function isUpperCase(char) {
  if (char.length !== 1) {
    return false;
  }
  if (!(
    ("a" <= char[0] && char[0] <= "z") ||
    ("A" <= char[0] && char[0] <= "Z"))
  ) {
    return false;
  }
  return char.toUpperCase() === char;
}

function camelCaseToSpace(text) {
  text = text.replace(/_/g, ' ');

  text = text.split('');

  for (let j = 1; j < text.length - 1; j++) {
    if (text[j - 1] === ' ' || text[j] === ' ' || text[j + 1] === ' ') {
      continue;
    }
    if (
      !isUpperCase(text[j - 1]) &&
      isUpperCase(text[j]) &&
      !isUpperCase(text[j + 1])) {
      text.splice(j, 0, ' ')
    }
  }
  return text.join('');
}

function numberToSize(size) {
  if (size < 2 ** 10) {
    return `${size} B`;
  }
  if (size < 2 ** 20) {
    return `${(size / 2 ** 10).toFixed(2)} KB`
  }
  if (size < 2 ** 30) {
    return `${(size / 2 ** 20).toFixed(2)} MB`
  }
  return `${(size / 2 ** 30).toFixed(2)} GB`
}

function fixData(key, data) {

  if (!isNaN(data)) {
    if (/size/i.test(key) && !/proportion/i.test(key)) {
      return numberToSize(parseFloat(data))
    }
    if (/bitrate/i.test(key)) {
      return numberToSize(parseFloat(data)) + '/s'
    }
    if (/delay/i.test(key) || /duration/i.test(key)) {
      return parseFloat(data) + 's';
    }
    if (/proportion/i.test(key)) {
      return (parseFloat(data) * 100).toFixed(2) + '%';
    }
    return parseFloat(data);
  }

  return data;
}

export function parseAsCulomnData(data) {
  const { track } = data.media;

  const output = [];
  for (let i = 0; i < track.length; i++) {
    const t = track[i];

    const dataToAdd = [];
    const type = t['@type'];

    const keys = Object.keys(t)
                       .filter(k => k[0] !== '@')
                       .filter(k => !(t[k] instanceof Object))
    ;
    keys.forEach(key => dataToAdd.push([
      camelCaseToSpace(key),
      fixData(key, t[key])
    ]));

    output.push({
      list: dataToAdd,
      type
    })
  }
  return output;
}
