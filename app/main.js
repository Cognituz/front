window.$      = require('jquery');
window.jQuery = require('jquery');
window.moment = require('moment');

require('angular');
require('angular-aria');
require('angular-animate');
require('angular-material');
require('angular-ui-router');
require('angular-bem');
require('angularjs-rails-resource');
require('satellizer');
require('ng-file-upload');
require('ng-material-datetimepicker');

angular
  .module('cognituzFront', [
    'ngAria',
    'ngAnimate',
    'ngMaterial',
    'ui.router',
    'tenphi.bem',
    'rails',
    'satellizer',
    'ngFileUpload',
    'ngMaterialDatePicker'
  ])

  // Configuration Blocks
  .config(require('config/material_theme'))
  .config(require('config/routes'))
  .config(require('config/satellizer'))
  .config(require('config/rails_resource'))

  // Misc services
  .service('Auth',         require('services/auth'))
  .service('lockingScope', require('services/locking_scope'))
 
  // Serializers, used by models to serialize and deserialize JSON
  .factory('DateSerializer', require('serializers/date'))

  // API consumers aka models
  .service('ContactForm',  require('models/contact_form'))
  .service('User',         require('models/user'))
  .service('SubjectGroup', require('models/subject_group'))
  .service('Neighborhood', require('models/neighborhood'))

  // Components
  .component('ctzApp',                   require('components/app/component'))
  .component('ctzHome',                  require('components/home/component'))
  .component('ctzContactForm',           require('components/contact_form/component'))
  .component('ctzAppLayout',             require('components/app/layout/component'))
  .component('ctzSignInFormPreselector', require('components/sign_in_form/preselector/component'))
  .component('ctzSignInForm',            require('components/sign_in_form/component'))
  .component('ctzSignUpForm',            require('components/sign_up_form/component'))
  .component('ctzStudentProfileEditor',  require('components/student/profile/editor/component'))
  .component('ctzAvatarInput',           require('components/avatar_input/component'))
  .component('ctzTeacherList',           require('components/teacher/list/component'))
  .component('ctzTeacherListFilters',    require('components/teacher/list/filters/component'))
  .component('ctzTeacherCard',           require('components/teacher/card/component'))
  .component('ctzTeacherProfile',        require('components/teacher/profile/component'))
  .component('ctzTeacherProfileEditor',  require('components/teacher/profile/editor/component'))
  .component('ctzSelect',                require('components/select/component'))
;
