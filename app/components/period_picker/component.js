const SFSOW  = require('lib/sfsow');
const Period = require('lib/period')
const $      = require('jquery');

module.exports = {
  templateUrl: '/components/period_picker/template.html',
  controller: class PeriodPickerController {
    translatedWdays = [
      "DOMINGO",
      "LUNES",
      "MARTES",
      "MIÉRCOLES",
      "JUEVES",
      "VIERNES",
      "SÁBADO"
    ];

    set _periodLength(length) { // In seconds
      this._periodHeight = (length * 100) / SFSOW.SECONDS_PER_DAY;
    }

    set _step(duration) { // In seconds
      this.steps = new Array(SFSOW.SECONDS_PER_DAY / duration);
      this.stepHeight = (duration * 100) / SFSOW.SECONDS_PER_DAY;
    }

    $onInit() {
      this._periods = [
        {
          desc: "Miércoles a las 21, Jueves as las 6",
          startSfsow: 3 * SFSOW.SECONDS_PER_DAY + 21 * 60 * 60,
          endSfsow:   4 * SFSOW.SECONDS_PER_DAY + 6 * 60 * 60,
        },
        {
          desc: 'Sábado a las 21, Domingo a las 6',
          startSfsow: (6 * SFSOW.SECONDS_PER_DAY + 21 * 60 * 60),
          endSfsow:   (7 * SFSOW.SECONDS_PER_DAY + 6 * 60 * 60),
        }
      ];

      // Period length in seconds
      this._periodLength = 2 * 60 * 60;
      this._step = 30 * 60;
    }

    segmentsIntercepting(wday) {
      return this._periods && this._periods
        .filter(p => Period.isWdayRange(p, wday))
        .map(p => Period.toSegment(p, wday));
    }

    setSelectedPeriod(wday, mouseEv) {
      this._extractHeight(mouseEv)
      | this._doSetSelectedPeriod(wday);
    }

    unsetSelectedPeriod() { delete this.selectedPeriod; }

    _doSetSelectedPeriod(y, wday) {
      const period = this._buildPeriod(y, wday);
      if (!Period.isWithinAvailabilityPeriods(period, this._periods)) return;
      this.selectedPeriod = period
    }

    _buildPeriod(y, wday) {
      const startY = do {
        if ((y - this._periodHeight/2) < 0) 0;
        else if ((y + this._periodHeight/2) > 100)
          100 - this._periodHeight;
        else this._closestTick(y - this._periodHeight/2)
      };
      const endY       = startY + this._periodHeight;
      const height     = endY - startY;
      const startSfsow = this._coordinatesToSfsow(startY, wday);
      const endSfsow   = this._coordinatesToSfsow(endY, wday);

      return {wday, startY, endY, height, startSfsow, endSfsow};
    }

    _coordinatesToSfsow(y, wday) {
      return (SFSOW.SECONDS_PER_DAY * y) / 100 + wday * SFSOW.SECONDS_PER_DAY;
    }

    _extractHeight(ev) {
      const $container = $(ev.currentTarget);
      const offset = $container.offset();
      return ((ev.pageY - offset.top) * 100) / $container.height();
    }

    _closestTick(y) { return Math.floor(y / this.stepHeight) * this.stepHeight; }
  }
};
