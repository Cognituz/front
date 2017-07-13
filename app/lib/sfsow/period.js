const DateTime = require('lib/date_time');

module.exports = new class SFSOWPeriod {
  overlapsDate(p, date) {
    const rangeA = this.toRange(p, date);
    const rangeB = DateTime.toRange(date);

    return rangeA.overlaps(rangeB);
  }

  toRange({start, end}, date) {
    const periodStart = moment(date).startOf('isoweek').add(start, 'seconds');
    const periodEnd   = moment(date).startOf('isoweek').add(end, 'seconds');

    return moment.range(periodStart, periodEnd);
  }
};
