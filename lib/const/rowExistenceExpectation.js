const { RowExistenceExpectation } = require('tablestore');

const { IGNORE, EXPECT_EXIST, EXPECT_NOT_EXIST } = RowExistenceExpectation;

module.exports = { IGNORE, EXPECT_EXIST, EXPECT_NOT_EXIST };
