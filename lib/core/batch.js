const TableStore = require('tablestore');
const { Primarykey } = require('../const/returnType');
const { FORWARD } = require('../const/direction');
const { JSON2COLUMN, TRANSFORM_RETURN, JSON2ROW } = require('../utils/dataTransform');

class Batch {
  constructor(client, tables) {
    this.client = client;
    this.tables = tables;

    this._default_max_versions = 1;
  }

  /**
   * 批量读取一个或多个表中的若干行数据
   * @param {Object[]} tables
   * @param {String} tables[].tableName 该表的表名
   * @param {Object[]} tables[].primaryKey 该行的主键
   * @param {*} tables[].primaryKey[][key] value
   * @param {Number} tables[].columnsToGet 指定输出的列
   * @param {String} tables[].startColumn 指定读取时的起始列
   * @param {String} tables[].endColumn 指定读取时的结束列
   * @param {Object} tables[].timeRange 查询数据时指定的时间戳范围或特定时间戳值
   * @param {Number} tables[].timeRange.startTime 起始时间戳
   * @param {Number} tables[].timeRange.endTime 结束时间戳
   * @param {Number} tables[].timeRange.specificTime 特定的时间戳值
   * @param {Number} tables[].maxVersions 读取数据时，返回的最多版本个数
   */
  async getRow(tables = []) {
    const params = {
      tables: [],
    };
    try {
      tables.forEach((item) => {
        const table = {
          tableName: item.tableName,
          columnsToGet: item.columnsToGet,
          startColumn: item.startColumn,
          endColumn: item.endColumn,
          timeRange: item.timeRange,
          maxVersions: item.maxVersions || this._default_max_versions,
        };
        const primaryKey = [];
        item.primaryKey.forEach((subItem) => {
          primaryKey.push(JSON2COLUMN(subItem));
        });
        table.primaryKey = primaryKey;
        params.tables.push(table);
      });
    } catch (e) {
      console.warn(e);
    }
    const res = await this.client.batchGetRow(params);
    return TRANSFORM_RETURN(res);
  }

  /**
   * 批量插入、修改或删除一个或多个表中的若干行数据
   * @param {Object[]} tables
   * @param {String} tables[].tableName 该表的表名
   * @param {Object[]} tables[].rows 该表中请求插入、更新和删除的行信息
   * @param {String} tables[].rows[].type 操作类型
   * @param {Number} tables[].rows[].rowExistenceExpectation 对该行进行行存在性检查的设置
   * @param {Number} tables[].rows[].returnType 返回数据的类型
   * @param {Number} tables[].rows[].rowChange 行数据，包括主键和属性列
   */
  writeRow(tables = []) {
    const params = {
      tables: [],
    };
    try {
      tables.forEach((t) => {
        const table = {
          tableName: t.tableName,
          rows: [],
        };
        t.rows.forEach((r) => {
          const row = {
            type: r.type,
            condition: new TableStore.Condition(r.rowExistenceExpectation, null),
            returnContent: {
              returnType: r.returnType || Primarykey,
            },
          };
          const metaData = this.tables.find(item => item.tableName === t.tableName);
          const rowData = JSON2ROW(r.rowChange, metaData);
          Object.assign(row, rowData);
          table.rows.push(row);
        });
        params.tables.push(table);
      });
    } catch (e) {
      console.warn(e);
    }
    return this.client.batchWriteRow(params);
  }

  /**
   * 读取指定主键范围内的数据
   * @param {Object} params
   * @param {String} params.tableName 要读取的数据所在的表名
   * @param {Number} params.direction 本次查询的顺序
   * @param {Number} params.maxVersions 读取数据时，返回的最多版本个数
   * @param {Object} params.timeRange 读取数据的版本时间戳范围
   * @param {Number} params.timeRange.startTime 起始时间戳
   * @param {Number} params.timeRange.endTime 结束时间戳
   * @param {Number} params.timeRange.specificTime 特定的时间戳值
   * @param {String} params.columnsToGet 需要返回的全部列的列名
   * @param {Number} params.limit 本次读取最多返回的行数
   * @param {String} params.startColumn 指定读取时的起始列
   * @param {String} params.endColumn 指定读取时的结束列
   * @param {Object} params.inclusiveStartPrimaryKey 本次范围读取的起始主键，若该行存在，则响应中一定会包含此行
   * @param {Object} params.exclusiveEndPrimaryKey 本次范围读取的终止主键，无论该行是否存在，响应中都不会包含此行
   */
  async getRange(params = {}) {
    const req = {
      tableName: params.tableName,
      direction: params.direction || FORWARD,
      maxVersions: params.maxVersions || this._default_max_versions,
      timeRange: params.timeRange,
      columnsToGet: params.columnsToGet,
      limit: params.limit,
      startColumn: params.startColumn,
      endColumn: params.endColumn,
    };

    req.inclusiveStartPrimaryKey = JSON2COLUMN(params.inclusiveStartPrimaryKey);
    req.exclusiveEndPrimaryKey = JSON2COLUMN(params.exclusiveEndPrimaryKey);

    const res = await this.client.getRange(req);
    return TRANSFORM_RETURN(res);
  }
}

module.exports = Batch;
