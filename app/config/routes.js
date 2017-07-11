module.exports = (
  $stateProvider,
  $urlRouterProvider,
  $locationProvider,
  $urlMatcherFactoryProvider
) => {
  "ngInject";

  const getCurrentUserOrRedirect =
    ($mdToast, $state, $timeout, Auth) => {
      'ngInject';

      return Auth
        .getCurrentUser()
        .catch(_ => {
          $state.go('app.signIn');
          $mdToast.showSimple('Necesitás ingresar para ver este contenido');
        });
    };

  $urlMatcherFactoryProvider.strictMode(false);
  $urlRouterProvider.otherwise('/');

  $locationProvider.html5Mode({
    enabled:     true,
    requireBase: false
  });

  $stateProvider
    .state('pete', {
      url: '/pete',
      template: '<ctz-period-picker whitelist="whitelist" blacklist="blacklist" layout-fill/>',
      controller: $scope => {
        'ngInject';

        const SFSOW  = require('lib/sfsow');
        const moment = require('moment');

        $scope.whitelist = [
          {
            desc: "Lunes de 8 a 20",
            startSfsow: 1 * SFSOW.SECONDS_PER_DAY + 8 * 60 * 60,
            endSfsow:   1 * SFSOW.SECONDS_PER_DAY + 20 * 60 * 60,
          },
          {
            desc: "Martes de 8 a 20",
            startSfsow: 2 * SFSOW.SECONDS_PER_DAY + 8 * 60 * 60,
            endSfsow:   2 * SFSOW.SECONDS_PER_DAY + 20 * 60 * 60,
          },
          {
            desc: "Miércoles a las 21 a Jueves as las 6",
            startSfsow: 3 * SFSOW.SECONDS_PER_DAY + 21 * 60 * 60,
            endSfsow:   4 * SFSOW.SECONDS_PER_DAY + 6 * 60 * 60,
          },
          {
            desc: "Jueves de 8 a 20",
            startSfsow: 4 * SFSOW.SECONDS_PER_DAY + 8 * 60 * 60,
            endSfsow:   4 * SFSOW.SECONDS_PER_DAY + 20 * 60 * 60,
          },
          {
            desc: "Viernes de 8 a 20",
            startSfsow: 5 * SFSOW.SECONDS_PER_DAY + 8 * 60 * 60,
            endSfsow:   5 * SFSOW.SECONDS_PER_DAY + 20 * 60 * 60,
          },
          {
            desc: 'Sábado a las 21 a Domingo a las 6',
            startSfsow: (6 * SFSOW.SECONDS_PER_DAY + 21 * 60 * 60),
            endSfsow:   (7 * SFSOW.SECONDS_PER_DAY + 6 * 60 * 60),
          }
        ];

        $scope.blacklist = [
          {
            startDate: moment().startOf('week').add(4, 'days').add(10, 'hours').toDate(),
            endDate:   moment().startOf('week').add(4, 'days').add(12, 'hours').toDate()
          }
        ];
      }
    })
    .state('home', {
      url: '/',
      template: '<ctz-home/>'
    })

    .state('app', {
      url: '/app',
      abstract: true,
      template: '<ctz-app-layout layout-fill/>'
    })

      // Auth
      .state('app.signIn', {
        url: '/ingresar',
        template: '<ctz-sign-in-form-wrapper layout-fill/>'
      })
      .state('app.resetPassword', {
        url: '/recuperar_contraseña',
        template: '<ctz-sign-up-form layout-fill/>'
      })
      .state('app.editPassword', {
        url: '/editar_contraseña',
        template: '<ctz-password-edit-form layout-fill/>'
      })

      .state('app.students', {
        url: '/estudiantes',
        abstract: true,
        template: '<ui-view layout-fill/>'
      })
        .state('app.students.signUp', {
          url: '/registrarse',
          template: '<ctz-sign-up-form user-type="student" layout-fill/>'
        })

      .state('app.teachers', {
        url: '/profesores',
        abstract: true,
        template: '<ui-view layout-fill/>'
      })

      // Secured by resolving currentUser
      .state('app.s', {
        url: '/s',
        abstract: true,
        resolve: {currentUser: getCurrentUserOrRedirect},
        template: '<ui-view layout-fill/>'
      })

        .state('app.s.appointments', {
          url: '/clases',
          abstract: true,
          template: '<ui-view layout-fill/>'
        })
        .state('app.s.appointments.list', {
          url: '',
          template: '<ctz-appointment-list/>'
        })
        .state('app.s.appointments.virtualClassroom', {
          url: '/:id/aula_virtual?userType',
          template: `<ctz-virtual-classroom
            appointment="appointment"
            user-type="userType"
            layout-fill
          />`,
          resolve: {
            appointment: (ClassAppointment, $stateParams) => {
              'ngInject';
              return ClassAppointment.get($stateParams.id);
            }
          },
          controller: inject({
            resolves: ['appointment'],
            stateParams: ['userType']
          })
        })

        .state('app.s.students', {
          url: '/estudiantes',
          abstract: true,
          template: '<ui-view layout-fill/>'
        })
          .state('app.s.students.profile', {
            url: '/perfil',
            abstract: true,
            template: '<ui-view layout-fill/>'
          })
            .state('app.s.students.profile.edit', {
              url: '/editar?afterSaveRedirectTo',
              template: '<ctz-student-profile-editor after-save="$ctrl.afterSave()" layout-fill/>',
              controllerAs: '$ctrl',
              controller: class {
                constructor($state, $stateParams) {
                  'ngInject';
                  this.$state       = $state;
                  this.$stateParams = $stateParams;
                }

                afterSave() {
                  const redirectLocation =
                    this.$stateParams &&
                    this.$stateParams.afterSaveRedirectTo;

                  redirectLocation && this.$state.go(redirectLocation);
                }
              }
            })

        .state('app.s.teachers', {
          url: '/profesores',
          abstract: true,
          template: '<ui-view layout-fill/>'
        })
          .state('app.s.teachers.profile', {
            url: '/perfil',
            abstract: true,
            template: '<ui-view layout-fill/>'
          })
            .state('app.s.teachers.profile.edit', {
              url: '/editar',
              template: '<ctz-teacher-profile-editor layout-fill/>',
            })
          .state('app.s.teachers.list', {
            url: '/',
            template: '<ctz-teacher-list/>'
          })
          .state('app.s.teachers.show', {
            url: '/:id',
            resolve: { teacher: (User, $stateParams) => User.get($stateParams.id) },
            onEnter: (teacher, $mdDialog, $mdMedia) => {
              'ngInject';

              $mdDialog.show({
                template: `
                  <md-dialog>
                    <ctz-teacher-reservation-form teacher="$ctrl.teacher" layout-fill/>
                  </md-dialog>
                `,
                locals: {teacher: teacher},
                fullscreen: $mdMedia('xs')
              });
            }
          })
  ;

  function inject({
    resolves:    resolvesNames,
    stateParams: paramNames,
    services:    serviceNames
  }) {
    const fn = ($scope, $stateParams, $injector, ...resolves) => {
      // Inject state params
      paramNames &&
      paramNames.forEach(param => $scope[param] = $stateParams[param]);

      // Inject resolutions
      resolvesNames &&
      resolvesNames.forEach((name, i) => $scope[name] = resolves[i]);

      // Inject services
      serviceNames &&
      serviceNames.forEach(sN => $scope[sN] = $injector.get(sN));
    };

    fn.$inject = ['$scope', '$stateParams', '$injector'];

    fn.$inject =
      resolvesNames ?
      fn.$inject.concat(resolvesNames) :
      fn.$inject;

    return fn;
  }
};
