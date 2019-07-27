class Client {
  constructor(config) {
    this.config = config;
    this.createTable = this.returnParams;
    this.updateTable = this.returnParams;
    this.describeTable = this.returnParams;
    this.listTable = this.returnParams;
    this.deleteTable = this.returnParams;

    this.getRow = this.returnParams;
    this.putRow = this.returnParams;
    this.updateRow = this.returnParams;
    this.deleteRow = this.returnParams;

    this.batchGetRow = this.returnParams;
    this.batchWriteRow = this.returnParams;
    this.getRange = this.returnParams;

    this.createSearchIndex = this.returnParams;
    this.deleteSearchIndex = this.returnParams;
    this.listSearchIndex = this.returnParams;
    this.describeSearchIndex = this.returnParams;

    this.search = this.returnParams;
  }

  returnParams(params) {
    return {
      config: this.config,
      params,
    };
  }
}

exports.Client = Client;
