const $ = require('jquery');

module.exports = {
  templateUrl: '/components/period_picker/template.html',

  bindings: {
    whitelist:      '<?',
    blacklist:      '<?',
    periodDuration: '<',
    stepDuration:   '<'
    minWeekDay:     '<?',
    maxWeekDay:     '<?',
    minSFSOD:       '<?',
    maxSFSOD:       '<?'
  },

  controller: class PeriodPickerController {
    set periodLength(minutes) { // In seconds
      this._periodHeight = (minutes * 60 * 100) / SFSOW.SECONDS_PER_DAY;
    }

    set step(minutes) { // In seconds
      this.steps = new Array(SFSOW.SECONDS_PER_DAY / duration);
      this.stepHeight = (duration * 100) / SFSOW.SECONDS_PER_DAY;
    }

    $onInit() {
      this.week = moment().week();

      this.whitelist = this.whitelist || [];
      this.blacklist = this.blacklist || [];

      this._generateWdayData();
    }

    increaseWeek() {
      this.week++;
      this._generateWdayData();
    }

    decreaseWeek() {
      this.week--;
      this._generateWdayData()
    }

    setSelectedPeriod(wday, mouseEv) {
      this._extractHeight(mouseEv)
      | this._doSetSelectedPeriod(wday);
    }

    unsetSelectedPeriod() { delete this.selectedPeriod; }

    _getDate(wday) {
      return moment()
        .startOf('year')
        .add(this.week - 1, 'weeks')
        .add(wday, 'days');
    }

    _generateWdayData() { // Changes in function of this.week
      this.wdayData =
        this.translatedWdays.map((name, wday) => {
          const day = this._getDate(wday);

          return {
            name, day,
            segments: this._segmentsFor(day)
          };
        });
    }

    _segmentsFor(day) {
      return [
        this._blacklistedPeriods(day).map(p => p | merge({type: 'blacklisted'})),
        this._whitelistedPeriods(day.weekday()).map(p => p | merge({type: 'whitelisted'}))
      ]
      | flatten();
    }

    _whitelistedPeriods(wday) {
      return this.whitelist
        .filter(p => SFSOWPeriod.isWithinWdayRange(p, wday))
        .map(p => SFSOWPeriod.toSegment(p, wday))
    }

    _blacklistedPeriods(day) {
      return this.blacklist
        .filter(p => DateTimePeriod.isWithinDay(p, day))
        .map(p => DateTimePeriod.toSegment(p));
    }

    _doSetSelectedPeriod(y, wday) {
      const period = this._buildPeriod(y, wday);
      if (!this._isValidPeriod(period)) return;
      this.selectedPeriod = period
    }

    _isValidPeriod(period) {
      let result = true;

      if (
        this.whitelist &&
        !SFSOWPeriod.isWithinAvailabilityPeriods(period, this.whitelist)
      )
        result = false;

      if (
        this.blacklist &&
        SFSOWPeriod.overlapsDateTimePeriods(period, this.blacklist)
      )
        result = false;

      return result;
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
