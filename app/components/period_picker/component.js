const {times, inRange} = require('lodash');


module.exports = {
  templateUrl: '/components/period_picker/template.html',
  controller: class {
    SECONDS_PER_DAY = 24 * 60 * 60;

    translatedWdays = [
      "DOMINGO",
      "LUNES",
      "MARTES",
      "MIÉRCOLES",
      "JUEVES",
      "VIERNES",
      "SÁBADO"
    ];

    $onInit() {
      this.segmentsIntercepting(3) | console.log()

      this.periods = [{
        startSfsow: 3 * this.SECONDS_PER_DAY + 21 * 60 * 60, // Miercoles a las 12
        endSfsow:   4 * this.SECONDS_PER_DAY + 6 * 60 * 60, // Jueves a las 00
      }];
    }

    segmentsIntercepting(wday) {
      return this.periods && this.periods
        .filter(p =>
          inRange(
            p.startSfsow,
            wday * this.SECONDS_PER_DAY,
            (wday+1) * this.SECONDS_PER_DAY
          ) ||
          inRange(
            p.endSfsow,
            wday * this.SECONDS_PER_DAY,
            (wday+1) * this.SECONDS_PER_DAY
          )
        )
        .map(p => this.periodToSegment(p, wday));
    }

    // Transforms an availability period into a segment representing
    // the percentage of the day the period covers
    periodToSegment(period, wday) {
      const startSfsow = Math.max(period.startSfsow, this.wdayStartSfsow(wday))
      const endSfsow   = Math.min(period.endSfsow, this.wdayEndSfsow(wday))

      const y1 =
        startSfsow === this.wdayStartSfsow(wday) ? 0 :
        (startSfsow % this.SECONDS_PER_DAY * 100) / this.SECONDS_PER_DAY;

      const y2 =
        endSfsow === this.wdayEndSfsow(wday) ? 100 :
        (endSfsow % this.SECONDS_PER_DAY * 100) / this.SECONDS_PER_DAY;

      return {y1,y2, startSfsow, endSfsow};
    }

    // Start of this week day in seconds from start of week
    wdayStartSfsow(wday) { return wday * this.SECONDS_PER_DAY; }
    wdayEndSfsow(wday) { return this.wdayStartSfsow(wday+1); }
  }
};

