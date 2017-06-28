const {times, inRange} = require('lodash');

const SECONDS_PER_DAY = 24 * 60 * 60;

module.exports = {
  templateUrl: '/components/period_picker/template.html',
  controller: class {
    translatedWdays = [
      "DOMINGO",
      "LUNES",
      "MARTES",
      "MIÉRCOLES",
      "JUEVES",
      "VIERNES",
      "SÁBADO"
    ];

    periods = [{
      startsAtSfsow: 3 * SECONDS_PER_DAY + 21 * 60 * 60, // Miercoles a las 12
      endsAtSfsow:   4 * SECONDS_PER_DAY + 3 * 60 * 60, // Jueves a las 00
    }];

    $onInit() {
      ({
        period: this.periods[0],
        wednesday_start: 3 * SECONDS_PER_DAY,
        thursday_start: 4 * SECONDS_PER_DAY
      }) | console.log()
    }

    periodsIntercepting(wday) {
      return this.periods.filter(p =>
        inRange(
          p.startsAtSfsow,
          wday * SECONDS_PER_DAY,
          (wday+1) * SECONDS_PER_DAY
        ) ||
        inRange(
          p.endsAtSfsow,
          wday * SECONDS_PER_DAY,
          (wday+1) * SECONDS_PER_DAY
        )
      );
    }

    // Transforms an availability period into week day segments,
    // where sfsow means "seconds from start of week",
    // and sfsod means "seconds from start of day"
    periodToSegments({startSfsow, endSfsow}) {
      // Locate the week day during which the period starts and ends
      const startWday = Math.floor(startSfsow / SECONDS_PER_DAY);
      const endWday   = Math.floor(endSfsow / SECONDS_PER_DAY);

      // Iterate over each week day that the period may span over
      this.range(startsAtWday, endsAtWday).forEach(wday => {
        const wdayStartSfsow = wday * SECONDS_PER_DAY;
        const wdayEndSfsow   = (wday + 1) * SECONDS_PER_DAY;

        // If period start is within this weerk day ...
        if (inRange(startSfsow, wdayStartSfsow, wdayEndSfsow)) {
          // ... and period end is also within this week day
          if (inRange(endSfsow, wdayStartSfsow, wdayEndSfsow))
            return {
              wday,
              startSfsod: startSfsow % SECONDS_PER_DAY,
              endSfsod:   startSfsow % SECONDS_PER_DAY
            };

          // Otherwise, this segment must end at midnight
          else
            return {
              wday,
              startSfsod: startSfsow % SECONDS_PER_DAY,
              endSfsod:   wdayEndSfsow
            };
        }
      });

      //const startsAtSfsod = startSfsow % SECONDS_PER_DAY
      //const endsAtSfsod   = endSfsow % SECONDS_PER_DAY
    }

    // Returns an array containing elements from a to b
    range(a, b, step = 1) {
      if (a === b) return [a];
      const res = [];
      const size = Math.floor((Math.abs(b-a) + step)/step);
      const sign = Math.abs(b-a)/(b-a);
      times(size, i => res.push(a + i*step*sign));
      return res;
    }
  }
};

