const TableStore = require('tablestore');
const { EXPECT_NOT_EXIST, IGNORE } = require('../const/rowExistenceExpectation');
const { Primarykey } = require('../const/returnType');
const { JSON2COLUMN, JSON2ROW, TRANSFORM_RETURN } = require('../utils/dataTransform');

class Row {
  constructor(client, tables) {
    this.client = client;
    this.tables = tables;

    this._max_versions = 1;
  }

  /**
   * 指定表
   * @param {tableName} tableName 表名
   */
  tableName(tableName) {
    this._table_name = tableName;
    this._meta_data = this.tables.find(item => item.tableName === tableName);
    return this;
  }

  /**
   * 对该行进行行存在性检查的设置
   * @param {Number} rowExistenceExpectation
   */
  rowExistenceExpectation(rowExistenceExpectation) {
    this._condition = new TableStore.Condition(rowExistenceExpectation, null);
    return this;
  }

  /**
   * 返回数据的类型
   * @param {Number} returnType
   */
  returnType(returnType) {
    this._return_type = returnType;
    return this;
  }

  /**
   * 该行的主键
   * @param {Object} primaryKey
   * @param {*} primaryKey[key] value
   */
  primaryKey(primaryKey) {
    this._primary_key = JSON2COLUMN(primaryKey);
    return this;
  }

  /**
   * 读取数据时，返回的最多版本个数
   * @param {Number} maxVersions
   */
  maxVersions(maxVersions) {
    this._max_versions = maxVersions;
    return this;
  }

  /**
   * 插入数据到指定的行
   * @param {Object} rows
   * @param {*} rows[key] value
   */
  put(rows = {}) {
    const params = {
      tableName: this._table_name,
      condition: this._condition || new TableStore.Condition(EXPECT_NOT_EXIST, null),
      returnContent: {
        returnType: this._return_type || Primarykey,
      },
    };
    const rowData = JSON2ROW(rows, this._meta_data);
    Object.assign(params, rowData);
    return this.client.putRow(params);
  }

  /**
   * 根据指定的主键读取单行数据
   * @param {Object} options
   * @param {String} options.columnsToGet 指定输出的列
   * @param {String} options.startColumn 指定读取时的起始列
   * @param {String} options.endColumn 指定读取时的结束列
   * @param {Object} options.timeRange 查询数据时指定的时间戳范围或特定时间戳值
   * @param {Number} options.timeRange.startTime 起始时间戳
   * @param {Number} options.timeRange.endTime 结束时间戳
   * @param {Number} options.timeRange.specificTime 特定的时间戳值
   */
  async get(options = {}) {
    const params = {
      tableName: this._table_name,
      primaryKey: this._primary_key,
      maxVersions: this._max_versions,
    };
    try {
      Object.assign(params, options);
    } catch (e) {
      console.warn(e);
    }
    const res = await this.client.getRow(params);
    return TRANSFORM_RETURN(res);
  }

  /**
   * 更新指定行的数据
   * @param {Object} updateOfAttributeColumns
   * @param {Object} updateOfAttributeColumns.PUT key:value
   * @param {Object} updateOfAttributeColumns.DELETE key:value
   * @param {String[]} updateOfAttributeColumns.DELETE_ALL keys
   */
  update(updateOfAttributeColumns = {}) {
    const columns = [];
    try {
      Object.keys(updateOfAttributeColumns).forEach((opName) => {
        if (['PUT', 'DELETE'].includes(opName)) {
          columns.push({
            [opName]: JSON2COLUMN(updateOfAttributeColumns[opName]),
          });
        } else {
          columns.push({
            [opName]: updateOfAttributeColumns[opName],
          });
        }
      });
    } catch (e) {
      console.warn(e);
    }
    const params = {
      tableName: this._table_name,
      primaryKey: this._primary_key,
      condition: this._condition || new TableStore.Condition(EXPECT_NOT_EXIST, null),
      updateOfAttributeColumns: columns,
    };
    return this.client.updateRow(params);
  }

  /**
   * 删除一行数据
   */
  get delete() {
    const params = {
      tableName: this._table_name,
      primaryKey: this._primary_key,
      condition: this._condition || new TableStore.Condition(IGNORE, null),
    };
    return this.client.deleteRow(params);
  }
}

module.exports = Row;
