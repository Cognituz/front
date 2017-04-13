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
require('ng-infinite-scroll');

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
    'ngMaterialDatePicker',
    'infinite-scroll'
  ])

  // Configuration Blocks
  .config(require('config/material_theme'))
  .config(require('config/routes'))
  .config(require('config/satellizer'))

  // Decorators
  .decorator('RailsResource', require('decorators/rails_resource'))
  .decorator('$mdDialog',     require('decorators/md_dialog'))

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

  // Filters
  .filter('fuzzy', require('filters/fuzzy'))

  // Components
  .component('ctzApp',                    require('components/app/component'))
  .component('ctzHome',                   require('components/home/component'))
  .component('ctzContactForm',            require('components/contact_form/component'))
  .component('ctzAppLayout',              require('components/app/layout/component'))
  .component('ctzSignInFormWrapper',      require('components/sign_in_form/wrapper/component'))
  .component('ctzSignInForm',             require('components/sign_in_form/component'))
  .component('ctzSignUpForm',             require('components/sign_up_form/component'))
  .component('ctzStudentProfileEditor',   require('components/student/profile/editor/component'))
  .component('ctzAvatarInput',            require('components/avatar_input/component'))
  .component('ctzTeacherList',            require('components/teacher/list/component'))
  .component('ctzTeacherListFilters',     require('components/teacher/list/filters/component'))
  .component('ctzTeacherCard',            require('components/teacher/card/component'))
  .component('ctzTeacherReservationForm', require('components/teacher/reservation_form/component'))
  .component('ctzTeacherProfileEditor',   require('components/teacher/profile/editor/component'))
  .component('ctzSubjectSelect',          require('components/subject_select/component'))
;

angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 100)
