const SFSOW = require('lib/sfsow');
const Period = require('lib/period')

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

    $onInit() {
      this.periods = [
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
    }

    segmentsIntercepting(wday) {
      return this.periods && this.periods
        .filter(p =>
          SFSOW.inWdayRange(p.startSfsow % SFSOW.SECONDS_PER_WEEK, wday) ||
          SFSOW.inWdayRange(p.endSfsow % SFSOW.SECONDS_PER_WEEK, wday)
        )
        .map(p => Period.toSegments(p, wday));
    }
  }
};
