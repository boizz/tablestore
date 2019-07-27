class Table {
  constructor(client, tables) {
    this.client = client;
    this.tables = tables;
    this.params = {};
  }

  /**
   * 指定表
   * @param {tableName} tableName 表名
   */
  tableName(tableName) {
    this._table_name = tableName;
    return this;
  }

  /**
   * 表的参数值
   * @param {Object} tableOptions
   * @param {Number} tableOptions.timeToLive 本张表中保存的数据的存活时间，单位秒
   * @param {Number} tableOptions.maxVersions 本张表保留的最大版本数
   * @param {Number} tableOptions.deviationCellVersionInSec 最大版本偏差
   */
  tableOptions(tableOptions) {
    this.params.tableOptions = tableOptions;
    return this;
  }

  /**
   * 表当前的预留读/写吞吐量数值
   * @param {Object} capacityUnit
   * @param {Number} capacityUnit.read
   * @param {Number} capacityUnit.write
   */
  capacityUnit(capacityUnit = {}) {
    this.params.reservedThroughput = this.params.reservedThroughput || {};
    this.params.reservedThroughput.capacityUnit = capacityUnit;
    return this;
  }

  /**
   * 创建表
   */
  get create() {
    const tableMeta = this.tables.find(info => info.tableName === this._table_name);
    const params = {
      tableMeta,
      reservedThroughput: {
        capacityUnit: {
          read: 0,
          write: 0,
        },
      },
      tableOptions: {
        timeToLive: -1,
        maxVersions: 1,
      },
    };
    Object.assign(params, this.params);
    return this.client.createTable(params);
  }

  /**
   * 更新表
   */
  get update() {
    const params = {
      tableName: this._table_name,
    };
    Object.assign(params, this.params);
    return this.client.updateTable(params);
  }

  /**
   * 查询表描述信息
   */
  get describe() {
    const params = {
      tableName: this._table_name,
    };
    return this.client.describeTable(params);
  }

  /**
   * 列出表名称
   */
  get list() {
    return this.client.listTable({});
  }

  /**
   * 删除表
   */
  get delete() {
    const params = {
      tableName: this._table_name,
    };
    const currentIndex = this.tables.findIndex(item => item.tableName === this._table_name);
    if (currentIndex !== -1) {
      this.tables.splice(currentIndex, 1);
    }
    return this.client.deleteTable(params);
  }
}

module.exports = Table;
