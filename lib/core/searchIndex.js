class Index {
  constructor(client, indexes) {
    this.client = client;
    this.indexes = indexes;
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
   * 指定索引
   * @param {tableName} tableName 索引名
   */
  indexName(indexName) {
    this._index_name = indexName;
    return this;
  }

  /**
   * 创建多元索引
   */
  get create() {
    const params = this.indexes.find(item => (
      item.indexName === this._index_name && item.tableName === this._table_name
    ));
    return this.client.createSearchIndex(params);
  }

  /**
   * 删除多元索引
   */
  get delete() {
    const params = {
      tableName: this._table_name,
      indexName: this._index_name,
    };
    const currentIndex = this.indexes.findIndex(item => (
      item.indexName === this._index_name && item.tableName === this._table_name
    ));
    if (currentIndex !== -1) {
      this.indexes.splice(currentIndex, 1);
    }
    return this.client.deleteSearchIndex(params);
  }

  /**
   * 列出多元索引列表
   */
  get list() {
    const params = {
      tableName: this._table_name,
    };
    return this.client.listSearchIndex(params);
  }

  /**
   * 查询多元索引描述信息
   */
  get describe() {
    const params = {
      tableName: this._table_name,
      indexName: this._index_name,
    };
    return this.client.describeSearchIndex(params);
  }
}

module.exports = Index;
