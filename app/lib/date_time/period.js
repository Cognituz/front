const DateTime = require('lib/date_time');

module.exports = new class DateTimePeriod {
  overlapsDate(p, date) {
    const rangeA = this.toRange(p);
    const rangeB = DateTime.toRange(date);

    return rangeA.overlaps(rangeB);
  }

  toRange({start, end}) {
    return moment.range(start, end);
  }
};
