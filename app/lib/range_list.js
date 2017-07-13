const DateTime                   = require('lib/date_time');
const {filter, flattenDeep, map} = require('lodash');

module.exports = class RangeList {
  static selectOverlappingDate(rangeList, date) {
    const dateRange = DateTime.toRange(date);
    return rangeList | filter(r => r.overlaps(dateRange));
  }

  static intersectDate(rangeList, date) {
    const dateRange = DateTime.toRange(date);
    return rangeList | map(r => r.intersect(dateRange))
  }

  static subtractRangeList(rangeListA, rangeListB) {
    return (
      rangeListA
        | map(rangeA => {
          const memo = rangeListB.filter(rangeB => rangeB.overlaps(rangeA));
          return memo.length ? memo.map(rangeB => rangeA.subtract(rangeB)) : rangeA;
        })
        | flattenDeep()
    );
  }

  static anyContainsRange(rangeList, rangeB) {
    return !!rangeList.find(rangeA => rangeA.contains(rangeB));
  }

  static anyOverlapsRange(rangeList, rangeB) {
    return !!rangeList.find(rangeA => rangeA.overlaps(rangeB));
  }
};
