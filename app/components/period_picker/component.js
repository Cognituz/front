const $               = require('jquery');
const RangeList       = require('lib/range_list');
const DateTimePeriod  = require('lib/date_time/period');
const SFSOWPeriod     = require('lib/sfsow/period');
const SECONDS_PER_DAY = require('lib/seconds_per_day')
const {map}           = require('lodash');

module.exports = {
  templateUrl: '/components/period_picker/template.html',

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
        | this._buildSelectedRange()
        | this._validateSelectedRange()

      if (range) {
        this.selectedRange = range;
        this.selectedSegment = {wday, ...this._rangeToSegment(range)};

        console.log(this.selectedSegment);
      }
    }

    unsetSelectedSegment() { delete this.selectedSegment; }

    // Private stuff
    _buildSelectedRange(date) {
      const start =
        moment.max(
          moment(date).startOf('day'),
          moment(date).subtract(this.periodDuration/2, 'm')
        );

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
      const $container =
        $(ev.currentTarget).parents('.ctz-period-picker__week-day-body');

      const offset = $container.offset();

      return ((ev.pageY - offset.top) * 100) / $container.height();
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
