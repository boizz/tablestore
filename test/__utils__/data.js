function compare(sample, data) {
  const res = [];
  try {
    if (sample === null) {
      res.push(sample === data);
    } else if (Array.isArray(sample)) {
      sample.forEach((item, i) => {
        res.push(compare(item, data[i]));
      });
    } else if (typeof sample === 'object') {
      if (Object.getPrototypeOf(sample).constructor.name === 'Int64') {
        res.push((sample.toNumber() === data.toNumber()));
      } else {
        Object.keys(sample).forEach((keyName) => {
          res.push(compare(sample[keyName], data[keyName]));
        });
      }
    } else {
      res.push(sample === data);
    }
  } catch (e) {
    console.warn(e, sample, data);
    res.push(false);
  }
  return res.every(item => item);
}

exports.compare = compare;
