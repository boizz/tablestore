[![Build Status](https://travis-ci.org/boizz/tablestore.svg?branch=master)](https://travis-ci.org/boizz/tablestore)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fboizz%2Ftablestore.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fboizz%2Ftablestore?ref=badge_shield)
[![NPM Package](https://img.shields.io/npm/v/tablestore-js.svg?style=flat-square)](https://www.npmjs.org/package/tablestore-js)
[![NPM Downloads](https://img.shields.io/npm/dm/tablestore-js.svg?style=flat-square)](https://npmjs.org/package/tablestore-js)

## 什么是表格存储
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fboizz%2Ftablestore.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fboizz%2Ftablestore?ref=badge_shield)


表格存储（Table Store）是阿里云自研的 NoSQL 多模型数据库，提供海量结构化数据存储以及快速的查询和分析服务。表格存储的分布式存储和强大的索引引擎能够支持 PB 级存储、千万 TPS 以及毫秒级延迟的服务能力。

## 为什么要选择阿里云表格存储

表格存储让我不需要关心运维层面的问题：可靠、安全、快速，并且非常灵活，无限无缝拓展，价格实惠；

> 引用官方，上面有更全面的说明：[产品优势](https://help.aliyun.com/document_detail/27282.html)

## 为什么要自己写一个 SDK

自己在用表格存储的时候，觉得官方的 SDK 需要我关心很多与表格存储设计原理相关的事情，例如 Long 类型或搜索；

而我作为用户使用，更希望关注与自己业务相关的问题，当业务复杂度日益增长，更需要想办法节约成本；

于是当我插入一条数据进表格、或者搜索的时候，把一些自己不想关心的操作放到了公共函数中处理，代码更加简洁，如下：

``` js
// PUT
const res = await tj.row('sampleTable')
  .rowExistenceExpectation(RowExistenceExpectation.IGNORE)
  .returnType(ReturnType.Primarykey)
  .put({
    gid: 20013,
    uid: 20013,
    col1: '表格存储',
    col2: '2',
    col3: 3.1,
    col4: -0.32,
    col5: 123456789,
  });

// Nested search
const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .query([{
    queryType: QueryType.TERM_QUERY,
    fieldName: 'Col_Nested.Sub_Col_Keyword',
    value: 'hangzhou',
  }]);
```

以上操作等同官方 SDK 的以下两个示例：
[单行数据操作](https://help.aliyun.com/document_detail/56354.html)、
[嵌套类型查询](https://help.aliyun.com/document_detail/100620.html)

当然这是一个取舍的问题，带来了便捷性的提升同时也舍弃了复杂的操作；例如我需要操作多版本数据时更常用官方的方式。

> 谨慎用于生产环境，推荐使用阿里云官方 SDK：[aliyun-tablestore-nodejs-sdk](https://github.com/aliyun/aliyun-tablestore-nodejs-sdk)

## 具体做的事情

这个 SDK 是基于官方的 [aliyun-tablestore-nodejs-sdk](https://github.com/aliyun/aliyun-tablestore-nodejs-sdk) 做了一层简易的封装，具体的一些改变如下：

1. 使用 **JSDoc** 注释规范维护代码；

2. 在 **getRow**、**search**、**batchGetRow** 和 **getRange** 方法上，返回的数据新增 **data** 字段，该字段由 **row** 或 **rows** 生成：

  - 将数据转换为 **key:value** 的格式；
  - 将 **Int64 对象类型**转换为 **Number 类型**；
  - 将 **Nested 字符串**通过 **JSON.parse** 转换成**对象**；
  - 生成 **data** 的过程不改变其他任何字段；

3. 与 **primaryKey**, **attributeColumns** 相关的传入都使用 **key:value** 方式传入，不用区分 **primaryKey**, **attributeColumns**；

4. 使用链式调用，不用关心参数结构；

5. 添加更多默认值；

## 如何使用

### 准备工作

在使用之前，请确保已开通 [表格存储](https://www.aliyun.com/product/ots)，并已完成密钥配置。

> 参考：[初始化](https://help.aliyun.com/document_detail/56352.html)

### 初始化

``` js
const { TJ } = require('tablestore-js');

const tj = new TJ(config, tables, indexes);
```

#### 参数说明

```
config {
  required string accessKeyId = 1
  required string accessKeySecret = 2
  required string endpoint = 3
  required string instancename = 4
  optional string stsToken = 5
  optional string maxRetries = 6
}
```

```
tables {
  required string tableName = 1
  required string primaryKey = 2
}
```

```
indexes {
  required string tableName = 1
  required string primaryKey = 2
}
```

- config: [参考：初始化](https://help.aliyun.com/document_detail/56352.html)
- tables: [参考：TableMeta](https://help.aliyun.com/document_detail/27343.html)
- indexes: [参考：创建多元索引](https://help.aliyun.com/document_detail/117452.html)

> 注意：参数的命名以 [aliyun-tablestore-nodejs-sdk](https://github.com/aliyun/aliyun-tablestore-nodejs-sdk) 为准

### 表操作

> 以下操作等同官方文档：
> - [创建表](https://help.aliyun.com/document_detail/100594.html)
> - [更新表](https://help.aliyun.com/document_detail/100598.html)
> - [查询表描述信息](https://help.aliyun.com/document_detail/100599.html)
> - [列出表名称](https://help.aliyun.com/document_detail/100597.html)
> - [删除表](https://help.aliyun.com/document_detail/100600.html)

#### 创建表

``` js
const res = await tj.table('sampleTable')
  .capacityUnit({
    read: 0,
    write: 0,
  })
  .tableOptions({
    timeToLive: -1,
    maxVersions: 1,
  })
  .create;
```

#### 更新表

``` js
const res = await tj.table('sampleTable')
  .tableOptions({
    maxVersions: 5,
  })
  .update;
```

#### 查询表描述信息

``` js
const res = await tj.table('sampleTable').describe;
```

#### 列出表名称

``` js
const res = await tj.table().list;
```

#### 删除表

``` js
const res = await tj.table('sampleTable').delete;
```

### 索引操作

> 以下操作等同官方文档：
> - [列出多元索引](https://help.aliyun.com/document_detail/100603.html)
> - [创建多元索引](https://help.aliyun.com/document_detail/100601.html)
> - [删除多元索引](https://help.aliyun.com/document_detail/100606.html)
> - [查询多元索引描述信息](https://help.aliyun.com/document_detail/100604.html)

#### 列出多元索引

``` js
const res = await tj.index('sampleTable').list;
```

#### 创建多元索引

``` js
const res = await tj.index('sampleTable')
  .indexName('sampleIndex')
  .create;
```

#### 删除多元索引

``` js
const res = await tj.index('sampleTable')
  .indexName('sampleIndex')
  .delete;
```

#### 查询多元索引描述信息

``` js
const res = await tj.index('sampleTable')
  .indexName('sampleIndex')
  .describe;
```

### 单行数据操作

> 以下操作等同于官方文档 [单行数据操作](https://help.aliyun.com/document_detail/56354.html)；

#### 插入一行数据

``` js
const { RowExistenceExpectation, ReturnType } = require('tablestore-js');

const res = await tj.row('sampleTable')
  .rowExistenceExpectation(RowExistenceExpectation.IGNORE)
  .returnType(ReturnType.Primarykey)
  .put({
    gid: 20013,
    uid: 20013,
    col1: '表格存储',
    col2: '2',
    col3: 3.1,
    col4: -0.32,
    col5: 123456789,
  });
```

#### 读取一行数据

> 暂未实现 **columnFilter** 的参数组装；

``` js
const res = await tj.row('sampleTable')
  .maxVersions(2)
  .primaryKey({
    gid: 20004,
    uid: 20004,
  })
  .get();
```

#### 更新一行数据

``` js
const { RowExistenceExpectation } = require('tablestore-js');

const res = await tj.row('sampleTable')
  .primaryKey({
    gid: 9,
    uid: 90,
  })
  .rowExistenceExpectation(RowExistenceExpectation.IGNORE)
  .update({
    PUT: {
      col4: 4,
      col5: '5',
      col6: 6,
    },
    DELETE: {
      col1: 1496826473186,
    },
    DELETE_ALL: ['col2'],
  });
```

#### 删除一行数据

``` js
const { RowExistenceExpectation } = require('tablestore-js');

const res = await tj.row('sampleTable')
  .rowExistenceExpectation(RowExistenceExpectation.IGNORE)
  .primaryKey({
    gid: 8,
    uid: 80,
  })
  .delete;
```

### 多行数据操作

> 以下操作等同于官方文档 [多行数据操作](https://help.aliyun.com/document_detail/56355.html)；

#### 批量读

> 以下仅对接口操作封装，文档中重试逻辑需要自行实现；

``` js
const res = await tj.batch.getRow([
  {
    tableName: 'sampleTable',
    primaryKey: [
      { gid: 20013, uid: 20013 },
      { gid: 20015, uid: 20015 },
    ],
    startColumn: 'col2',
    endColumn: 'col4',
  },
  {
    tableName: 'notExistTable',
    primaryKey: [{ gid: 10001, uid: 10001 }],
  },
]);
```

#### 批量写

``` js
const res = await tj.batch.writeRow([{
  tableName: 'sampleTable',
  rows: [{
    type: 'PUT',
    rowExistenceExpectation: RowExistenceExpectation.IGNORE,
    returnType: ReturnType.Primarykey,
    rowChange: {
      gid: 8,
      uid: 80,
      attrCol1: 'test1',
      attrCol2: 'test2',
    },
  }],
}]);
```

#### 范围读

``` js
const res = await tj.batch.getRange({
  tableName: 'sampleTable',
  direction: TableStore.Direction.FORWARD,
  inclusiveStartPrimaryKey: {
    gid: INF.MIN,
    uid: INF.MIN,
  },
  exclusiveEndPrimaryKey: {
    gid: INF.MAX,
    uid: INF.MAX,
  },
  limit: 50,
});
```

### 多元索引查询操作

> 以下操作等同官方文档：
> - [精确查询](https://help.aliyun.com/document_detail/100612.html)
> - [匹配查询](https://help.aliyun.com/document_detail/100613.html)
> - [前缀查询](https://help.aliyun.com/document_detail/100614.html)
> - [范围查询](https://help.aliyun.com/document_detail/100616.html)
> - [通配符查询](https://help.aliyun.com/document_detail/100617.html)
> - [地理位置查询](https://help.aliyun.com/document_detail/100618.html)
> - [嵌套类型查询](https://help.aliyun.com/document_detail/100620.html)
> - [多条件组合查询](https://help.aliyun.com/document_detail/100619.html)
> - [排序和翻页](https://help.aliyun.com/document_detail/100621.html)

#### 精确查询

##### TermQuery

``` js
const { QueryType } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .query([{
    queryType: QueryType.TERM_QUERY,
    fieldName: 'Col_Keyword',
    value: 'hangzhou',
  }]);
```

##### TermsQuery

``` js
const { QueryType } = require('tablestore-js');

res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .query([{
    queryType: QueryType.TERMS_QUERY,
    fieldName: 'Col_Keyword',
    value: ['hangzhou', 'shanghai'],
  }]);
```

#### 匹配查询

##### MatchAllQuery

``` js
const { QueryType } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .returnFields(['Col_1', 'Col_2', 'Col_3'])
  .query([{
    queryType: QueryType.MATCH_ALL_QUERY,
  }]);
```

##### MatchQuery

``` js
const { QueryType } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .query([{
    queryType: QueryType.MATCH_QUERY,
    fieldName: 'Col_Keyword',
    value: 'hangzhou',
  }]);
```

##### MatchPhraseQuery

``` js
const { QueryType } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .query([{
    queryType: QueryType.MATCH_PHRASE_QUERY,
    fieldName: 'Col_Text',
    value: 'hangzhou shanghai',
  }]);
```

#### 前缀查询

``` js
const { QueryType } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .query([{
    queryType: QueryType.PREFIX_QUERY,
    fieldName: 'Col_Keyword',
    value: 'hang',
  }]);
```

#### 范围查询

``` js
const { QueryType } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .query([{
    queryType: QueryType.RANGE_QUERY,
    fieldName: 'Col_Long',
    options: {
      rangeFrom: 1,
      includeLower: true,
      rangeTo: 10,
      includeUpper: false,
    },
  }]);
```

#### 通配符查询

``` js
const { QueryType } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .query([{
    queryType: QueryType.WILDCARD_QUERY,
    fieldName: 'Col_Keyword',
    value: 'table*e',
  }]);
```

#### 地理位置查询

##### GeoBoundingBoxQuery

``` js
const { QueryType } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .query([{
    queryType: QueryType.GEO_BOUNDING_BOX_QUERY,
    fieldName: 'Col_GeoPoint',
    options: {
      topLeft: '10,0',
      bottomRight: '0,10',
    },
  }]);
```

##### GeoDistanceQuery

``` js
const { QueryType } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .query([{
    queryType: QueryType.GEO_DISTANCE_QUERY,
    fieldName: 'Col_GeoPoint',
    options: {
      centerPoint: '1,1',
      distance: 10000,
    },
  }]);
```

##### GeoPolygonQuery

``` js
const { QueryType } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .query([{
    queryType: QueryType.GEO_POLYGON_QUERY,
    fieldName: 'Col_GeoPoint',
    options: {
      points: ['0,0', '5,5', '5,0'],
    },
  }]);
```

#### 嵌套类型查询

``` js
const { QueryType } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .query([{
    queryType: QueryType.TERM_QUERY,
    fieldName: 'Col_Nested.Sub_Col_Keyword',
    value: 'hangzhou',
  }]);
```

#### 多条件组合查询

``` js
const { BoolQueryType, QueryType } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .boolType(BoolQueryType.MUST_QUERIES)
  .minimumShouldMatch(1)
  .query([
    {
      queryType: QueryType.RANGE_QUERY,
      fieldName: 'Col_Long',
      options: {
        rangeFrom: 3,
        includeLower: true,
      },
    },
    {
      queryType: QueryType.TERM_QUERY,
      fieldName: 'Col_Keyword',
      value: 'hangzhou',
    },
  ]);
```

#### 排序和翻页

##### 查询时指定排序方式

###### ScoreSort

``` js
const { SortOrder } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .scoreSort(SortOrder.ASC)
  .query();
```

###### PrimaryKeySort

``` js
const { SortOrder } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .primaryKeySort(SortOrder.DESC)
  .query();
```

###### FieldSort

``` js
const { SortOrder } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .fieldSort({
    Col_Keyword: SortOrder.DESC,
    Col_Long: SortOrder.DESC,
  })
  .query();
```

###### GeoDistanceSort

``` js
const { SortOrder } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .geoDistanceSort({
    fieldName: 'Col_Geo_Point',
    points: ['0,0'],
    order: SortOrder.ASC,
  })
  .query();
```

##### 翻页方式

###### 使用 limit 和 offset

``` js
const { queryType } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(90)
  .limit(10)
  .query([{
    queryType: QueryType.MATCH_ALL_QUERY,
  }]);
```

###### 使用 token 进行翻页

``` js
const { queryType } = require('tablestore-js');

const res = await tj.search(TABLE_NAME)
  .indexName(INDEX_NAME)
  .offset(0)
  .limit(10)
  .token(null)
  .returnFields(['pic_tag', 'pic_description', 'time', 'pos'])
  .query([{
    queryType: QueryType.MATCH_ALL_QUERY,
  }]);
```

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fboizz%2Ftablestore.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fboizz%2Ftablestore?ref=badge_large)