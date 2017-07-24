const $               = require('jquery');
const RangeList       = require('lib/range_list');
const DateTimePeriod  = require('lib/date_time/period');
const SFSOWPeriod     = require('lib/sfsow/period');
const SECONDS_PER_DAY = require('lib/seconds_per_day')
const {map, minBy}    = require('lodash');

module.exports = {
  templateUrl: '/components/period_picker/template.html',

  require: {ngModel: 'ngModel'},

  bindings: {
    whitelist:      '<?',
    blacklist:      '<?',
    periodDuration: '<',
    stepDuration:   '<',
    minWeekDay:     '<?',
    maxWeekDay:     '<?',
    minSFSOD:       '<?',
    maxSFSOD:       '<?'
  },

  controller: class PeriodPickerController {
    $onInit() {
      this.currentWeekStart = moment().startOf('isoweek');
      this._blacklistedRanges = this.blacklist.map(p => DateTimePeriod.toRange(p));
      this._calculateWeekDayData();
    }

    nextWeek() {
      this.currentWeekStart.add(1, 'w'); // Yes, add MUTATES!
      this._calculateWeekDayData();
    }

    prevWeek() {
      this.currentWeekStart.subtract(1, 'w'); // Yes, subtract MUTATES!
      this._calculateWeekDayData();
    }

    setSelectedSegment(wday, mouseEv) {
      const range =
        this._extractHeight(mouseEv)
        | this._heightToSfsod()
        | this._dateFromSfsodAndWday(wday)
        | this._getClosestStep()
        | this._buildSelectedRange()
        | this._validateSelectedRange();

      if (range) {
        this.selectedRange = range;
        this.selectedSegment = {wday, ...this._rangeToSegment(range)};
      }
    }

    unsetSelectedSegment() { delete this.selectedSegment; }

    unconfirmSelection() {
      delete this.confirmedSegment;
      this.ngModel.$setViewValue(undefined);
    }

    confirmSelection() {
      this.confirmedSegment = this.selectedSegment;
      this.confirmedRange = this.selectedRange;
      this.ngModel.$setViewValue(this.confirmedRange.toDate());
    }

    // Private stuff
    _getClosestStep(date) {
      const dateMfsod = // Minutes from start of day
        moment(date).hours() * 60 +
        moment(date).minutes();

      const prevStep =
        moment(date)
          .startOf('day')
          .add(this.stepDuration * Math.floor(dateMfsod / this.stepDuration), 'm');

      const nextStep =
        moment(date)
          .startOf('day')
          .add(this.stepDuration * Math.ceil(dateMfsod / this.stepDuration), 'm');

      return do {
        if (nextStep > moment(date).endOf('day')) prevStep;
        else [prevStep, nextStep] | minBy(stepDate => Math.abs(stepDate.diff(date)));
      }
    }

    _buildSelectedRange(date) {
      const start = do {
        const lowerBound  = moment(date).subtract(this.periodDuration/2, 'm');
        const upperBound  = moment(date).add(this.periodDuration/2, 'm');
        const startOfDay = moment(date).startOf('day');
        const endOfDay   = moment(date).endOf('day');

        if (lowerBound < startOfDay)
          startOfDay;
        else if (upperBound > endOfDay)
          moment(endOfDay).subtract(this.periodDuration, 'm');
        else lowerBound;
      };

      const end = moment(start).add(this.periodDuration, 'm');

      return moment.range(start, end);
    }

    _validateSelectedRange(range) {
      if (!RangeList.anyContainsRange(this._whitelistedRanges, range)) return;
      if (RangeList.anyOverlapsRange(this._blacklistedRanges, range)) return;
      return range;
    }

    _calculateWeekDayData() {
      this._calculateWhitelistedRanges();
      this.weekDayData = [0,1,2,3,4,5,6].map(wday => this._wdayDataFor(wday));
    }

    _calculateWhitelistedRanges() {
      this._whitelistedRanges =
        this.whitelist
          | map(p => SFSOWPeriod.toRange(p, this.currentWeekStart));
    }

    _wdayDataFor(wday) {
      const m    = moment(this.currentWeekStart).add(wday, 'days');
      const date = m.toDate();

      return {
        date, wday,
        availableSegments: this._availableSegmentsFor(date),
        name: this._getWeekDayName(m),
      };
    }

    _getWeekDayName(moment) { return moment.format('dddd').charAt(0).toUpperCase(); }

    _availableSegmentsFor(date) {
      return (
        this._whitelistedRanges
        | RangeList.selectOverlappingDate(date)
        | RangeList.intersectDate(date)
        | RangeList.subtractRangeList(this._blacklistedRanges)
        | map(wr => this._rangeToSegment(wr, date))
      );
    }

    _rangeToSegment(r) {
      const startSfsod = r.start.hours() * 60 * 60 + r.start.minutes() * 60 + r.start.seconds();
      const endSfsod   = r.end.hours() * 60 * 60 + r.end.minutes() * 60 + r.end.seconds();

      const startY = (startSfsod * 100) / SECONDS_PER_DAY;
      const endY   = (endSfsod * 100) / SECONDS_PER_DAY;

      const height = endY - startY;

      return {startY, height};
    }

    _extractHeight(ev) {
      const $container = $(ev.currentTarget);
      const offset = $container.offset();
      const pageY =
        ev.originalEvent.constructor === TouchEvent ?
          ev.touches[0].pageY :
          ev.pageY;

      return ((pageY - offset.top) * 100) / $container.height();
    }

    _heightToSfsod(y) {
      return (y * SECONDS_PER_DAY) / 100;
    }

    _dateFromSfsodAndWday(sfsod, wday) {
      return (
        moment(this.currentWeekStart)
          .add(wday, 'd')
          .add(sfsod, 's')
      );
    }
  }
};
