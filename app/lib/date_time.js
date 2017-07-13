module.exports = new class DateTime {
  toRange(date) {
    const start = moment(date).startOf('day');
    const end   = moment(date).endOf('day');

    return moment.range(start, end);
  }
}
