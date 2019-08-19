const { SIMPLE2LONG, LONG2SIMPLE } = require('./longTransform');
const { NESTED2STRING, STRING2NESTED } = require('./nestedTransform');

function COLUMN2JSON(col = []) {
  const res = {};
  try {
    col.forEach((obj) => {
      res[obj.name] = LONG2SIMPLE(obj.value);
    });
  } catch (e) {
    console.warn(e);
  }
  return res;
}

function JSON2COLUMN(jsonData = {}) {
  const columns = [];
  try {
    Object.keys(jsonData).forEach((fieldName) => {
      const value = SIMPLE2LONG(
        NESTED2STRING(jsonData[fieldName]),
      );
      columns.push({ [fieldName]: value });
    });
  } catch (e) {
    console.warn(e);
  }
  return columns;
}

function JSON2ROW(jsonData = {}, tableMeta) {
  const primaryKey = [];
  const attributeColumns = [];
  try {
    Object.keys(jsonData).forEach((fieldName) => {
      const value = SIMPLE2LONG(
        NESTED2STRING(jsonData[fieldName]),
      );
      if (tableMeta.primaryKey.find(keyOption => keyOption.name === fieldName)) {
        primaryKey.push({ [fieldName]: value });
      } else {
        attributeColumns.push({ [fieldName]: value });
      }
    });
  } catch (e) {
    console.warn(e);
  }
  return { primaryKey, attributeColumns };
}

function ROW2JSON(rowData) {
  let { primaryKey, attributes } = rowData;
  primaryKey = primaryKey || [];
  attributes = attributes || [];
  const data = {};
  try {
    primaryKey.forEach((col) => {
      const value = LONG2SIMPLE(
        STRING2NESTED(col.value),
      );
      data[col.name] = value;
    });
    attributes.forEach((col) => {
      const value = LONG2SIMPLE(
        STRING2NESTED(col.columnValue),
      );
      data[col.columnName] = value;
    });
  } catch (e) {
    console.warn(e);
  }
  return data;
}

function TRANSFORM_RETURN(res = {}) {
  if (res.row) {
    res.data = ROW2JSON(res.row);
  } else if (res.rows && Array.isArray(res.rows)) {
    res.data = [];
    res.rows.forEach((row) => {
      res.data.push(ROW2JSON(row));
    });
  } else if (res.tables && Array.isArray(res.tables)) {
    res.data = {};
    res.tables.forEach((table) => {
      if (table.length) {
        res.data[table[0].tableName] = [];
        table.forEach((row) => {
          res.data[table[0].tableName].push(ROW2JSON(row));
        });
      }
    });
  }
  return res;
}

exports.COLUMN2JSON = COLUMN2JSON;
exports.JSON2COLUMN = JSON2COLUMN;
exports.JSON2ROW = JSON2ROW;
exports.ROW2JSON = ROW2JSON;
exports.TRANSFORM_RETURN = TRANSFORM_RETURN;
