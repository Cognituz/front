require('angular');
require('angular-aria');
require('angular-animate');
require('angular-material');
require('angular-ui-router');
require('angular-bem');
require('angularjs-rails-resource');
require('satellizer');

angular
  .module('cognituzFront', [
    'ngAria',
    'ngAnimate',
    'ngMaterial',
    'ui.router',
    'tenphi.bem',
    'rails',
    'satellizer'
  ])

  // Configuration Blocks
  .config(require('config/material_theme'))
  .config(require('config/routes'))
  .config(require('config/satellizer'))

  // Services
  .service('Auth',         require('services/auth'))
  .service('lockingScope', require('services/locking_scope'),)

  // API consumers or models
  .service('ContactForm', require('models/contact_form'))
  .service('User',        require('models/user'))

  // Components
  .component('ctzApp',               require('components/app/component'))
  .component('ctzHome',              require('components/home/component'))
  .component('ctzContactForm',       require('components/contact_form/component'))
  .component('ctzAppLayout',         require('components/app/layout/component'))

  .component('ctzSignInFormPreselector', require('components/sign_in_form/preselector/component'))
  .component('ctzSignInForm',            require('components/sign_in_form/component'))
  .component('ctzSignUpForm',            require('components/sign_up_form/component'))

  //.component('ctzStudentProfileEdiior', require('components/student/profile_editor'))
;
