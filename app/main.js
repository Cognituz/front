require('angular');
require('angular-aria');
require('angular-animate');
require('angular-material');
require('angular-ui-router');
require('angular-bem');
require('angularjs-rails-resource');
require('AngularDevise');
require('angular-lock');
require('angular-jwt');

angular
  .module('cognituzFront', [
    'ngAria',
    'ngAnimate',
    'ngMaterial',
    'ui.router',
    'tenphi.bem',
    'rails',
    'Devise',
    'auth0.lock',
    'angular-jwt'
  ])

  // Configuration Blocks
  .config(require('config/material_theme'))
  .config(require('config/routes'))
  .config(require('config/angular_devise'))
  .config(require('config/auth0_lock'))

  // Serivces
  .service('ContactForm', require('services/contact_form'))

  // Components
  .component('ctzApp',         require('components/app/component'))
  .component('ctzHome',        require('components/home/component'))
  .component('ctzContactForm', require('components/contact_form/component'))
  .component('ctzAppLayout',   require('components/app/layout/component'))
  .component('ctzSignInForm',  require('components/sign_in_form/component'))
;
