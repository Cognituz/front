module.exports = ($mdThemingProvider) => {
  'ngInject';

  $mdThemingProvider.definePalette('cognituzGreen', {
    '50':                   '#c8d9b2',
    '100':                  '#bcd1a0',
    '200':                  '#b0c88f',
    '300':                  '#a4c07e',
    '400':                  '#98b76d',
    '500':                  '#8CAF5C',
    '600':                  '#7fa250',
    '700':                  '#729147',
    '800':                  '#64803f',
    '900':                  '#576f36',
    'A100':                 '#ffffff',
    'A200':                 '#e5eddb',
    'A400':                 '#9ab971',
    'A700':                 '#6c8a44',
    'contrastDefaultColor': 'light',
    'contrastDarkColors':   '50 100 200 400 A100 A200 A400'
  });

  $mdThemingProvider.definePalette('cognituzBlue', {
    '50':                   '#c8ddec',
    '100':                  '#8ebad9',
    '200':                  '#64a1cb',
    '300':                  '#3a7eae',
    '400':                  '#336e97',
    '500':                  '#2b5d80',
    '600':                  '#234c69',
    '700':                  '#1c3c52',
    '800':                  '#142b3b',
    '900':                  '#0c1a24',
    'A100':                 '#c8ddec',
    'A200':                 '#8ebad9',
    'A400':                 '#336e97',
    'A700':                 '#1c3c52',
    'contrastDefaultColor': 'light',
    'contrastDarkColors':   '50 100 200 A100 A200'
  });

  $mdThemingProvider.definePalette('cognituzPeach', {
    '50':                   '#f7e7de',
    '100':                  '#e9b9a0',
    '200':                  '#df9872',
    '300':                  '#d16e38',
    '400':                  '#bf5f2c',
    '500':                  '#a65326',
    '600':                  '#8d4720',
    '700':                  '#743a1b',
    '800':                  '#5b2e15',
    '900':                  '#42210f',
    'A100':                 '#f7e7de',
    'A200':                 '#e9b9a0',
    'A400':                 '#bf5f2c',
    'A700':                 '#743a1b',
    'contrastDefaultColor': 'light',
    'contrastDarkColors':   '50 100 200 300 A100 A200'
  });

  $mdThemingProvider
    .theme('default')
      .primaryPalette('cognituzGreen', {
        'default': '500',
        'hue-1':   '400',
        'hue-2':   '300',
        'hue-3':   '200'
      })
      .accentPalette('cognituzBlue', {
          'default': '500',
          'hue-1':   'A700',
          'hue-2':   '700',
          'hue-3':   '800'
      })
      .warnPalette('cognituzPeach');
};
