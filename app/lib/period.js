const SFSOW = require('lib/sfsow');
const {inRange} = require('lodash');

module.exports = new class Period {
  isWithinAvailabilityPeriods({startSfsow, endSfsow}, periods) {
    return !!periods.find(p =>
      (
        p.startSfsow <= startSfsow &&
        p.endSfsow >= endSfsow
      ) ||
      (
        SFSOW.relative(p.startSfsow) <= startSfsow &&
        SFSOW.relative(p.endSfsow) >= endSfsow
      )
    );
  }

  isWdayRange({startSfsow, endSfsow}, wday) {
    return (
      SFSOW.inWdayRange(startSfsow, wday) ||
      SFSOW.inWdayRange(endSfsow, wday) ||
      SFSOW.inWdayRange(startSfsow % SFSOW.SECONDS_PER_WEEK, wday) ||
      SFSOW.inWdayRange(endSfsow % SFSOW.SECONDS_PER_WEEK, wday)
    );
  }

  // Transforms an availability period into segments (y1, y2)
  // representing the portion of the day the period covers
  toSegment(period, wday) {
    const {startSfsod, endSfsod} = this._relativeToWday(period, wday);

    const startY = (startSfsod * 100) / SFSOW.SECONDS_PER_DAY;
    const endY   = (endSfsod * 100) / SFSOW.SECONDS_PER_DAY;

    const height = endY - startY;

    const res = {
      wday, startY, endY, height, startSfsod, endSfsod,
      desc: period.desc
    };

    return res;
  }

  _relativeToWday({startSfsow, endSfsow}, wday) {
    const offset = do {
      if (
        !SFSOW.inWdayRange(startSfsow, wday) &&
        !SFSOW.inWdayRange(endSfsow, wday)
      ) {
        if (startSfsow > SFSOW.START_OF_WEEK) - SFSOW.SECONDS_PER_WEEK;
        else if(startSfow < SFSOW.START_OF_WEEK) SFSOW.SECONDS_PER_WEEK;
      }
      else 0;
    }

    const relativeStartSfsow = Math.max(SFSOW.wdayStart(wday), startSfsow + offset);
    const relativeEndSfsow   = Math.min(SFSOW.wdayEnd(wday), endSfsow + offset);

    const startSfsod = relativeStartSfsow % SFSOW.SECONDS_PER_DAY;
    const endSfsod =
        relativeEndSfsow === SFSOW.wdayEnd(wday) ?
          SFSOW.SECONDS_PER_DAY :
          relativeEndSfsow % SFSOW.SECONDS_PER_DAY;

    return {startSfsod, endSfsod};
  }
};
