const SFSOW = require('lib/sfsow');
const {inRange} = require('lodash');

module.exports = new class Period {
  relativeToWday({startSfsow, endSfsow}, wday) {
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

  // Transforms an availability period into segments (y1, y2)
  // representing the portion of the day the period covers
  toSegments(period, wday) {
    const {startSfsod, endSfsod} = this.relativeToWday(period, wday);


    const y1 = (startSfsod * 100) / SFSOW.SECONDS_PER_DAY;
    const y2 = (endSfsod * 100) / SFSOW.SECONDS_PER_DAY;

    const height = y2 - y1;

    const res = {
      wday, y1, y2, height, startSfsod, endSfsod,
      desc: period.desc
    };

    res | console.log();

    return res;
  }
};
