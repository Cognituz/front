const {inRange} = require('lodash');

module.exports = new class SFSOW {
  SECONDS_PER_DAY  = 24 * 60 * 60;
  SECONDS_PER_WEEK = 7 * this.SECONDS_PER_DAY;
  START_OF_WEEK    = 0;
  END_OF_WEEK      = this.SECONDS_PER_WEEK;

  inWdayRange(sfsow, wday) {
    const wdayStart = this.wdayStart(wday);
    const wdayEnd   = this.wdayEnd(wday);
    return sfsow | inRange(wdayStart, wdayEnd);
  }

  wdayStart(wday) { return wday * this.SECONDS_PER_DAY; }
  wdayEnd(wday) { return this.wdayStart(wday+1); }
};
