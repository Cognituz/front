require('angular');
require('angular-aria');
require('angular-animate');
require('angular-material');
require('angular-ui-router');
require('angular-bem');

angular
  .module('cognituzFront', [
    'ngAria',
    'ngAnimate',
    'ngMaterial',
    'ui.router',
    'tenphi.bem'
  ])

  .config(require('config/material_theme'))
  .config(require('config/routes'))

  .component('ctzApp', require('components/app/component'))
  .component('ctzHome', require('components/home/component'));
