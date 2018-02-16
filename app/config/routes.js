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
      template: `
        {{ selectedPeriod }}

        <ctz-period-picker
          ng-model='selectedPeriod'
          layout-fill
          period-duration=120
          step-duration=30
          whitelist="whitelist"
          blacklist="blacklist"
        />
      `,
      controller: $scope => {
        'ngInject';

        const moment = require('moment');
        const SECONDS_PER_DAY = 24 * 60 * 60;

        $scope.whitelist = [
          {
            desc: "Lunes de 8 a 20",
            start: 0 * SECONDS_PER_DAY + 8 * 60 * 60,
            end:   0 * SECONDS_PER_DAY + 20 * 60 * 60,
          },
          {
            desc: "Martes de 8 a 20",
            start: 1 * SECONDS_PER_DAY + 8 * 60 * 60,
            end:   1 * SECONDS_PER_DAY + 20 * 60 * 60,
          },
          {
            desc: "Miércoles a las 21 a Jueves as las 6",
            start: 2 * SECONDS_PER_DAY + 21 * 60 * 60,
            end:   3 * SECONDS_PER_DAY + 6 * 60 * 60,
          },
          {
            desc: "Jueves de 8 a 20",
            start: 3 * SECONDS_PER_DAY + 8 * 60 * 60,
            end:   3 * SECONDS_PER_DAY + 20 * 60 * 60,
          },
          {
            desc: "Viernes de 8 a 20",
            start: 4 * SECONDS_PER_DAY + 8 * 60 * 60,
            end:   4 * SECONDS_PER_DAY + 20 * 60 * 60,
          },
          {
            desc: 'Sábado a las 21 a Domingo a las 6',
            start: (5 * SECONDS_PER_DAY + 21 * 60 * 60),
            end:   (6 * SECONDS_PER_DAY + 6 * 60 * 60),
          }
        ];

        $scope.blacklist = [
          {
            desc:  "Miércoles a de 10 a 12",
            start: moment().startOf('isoweek').add(3, 'days').add(10, 'hours').toDate(),
            end:   moment().startOf('isoweek').add(3, 'days').add(12, 'hours').toDate()
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
      .state('app.recoverPassword', {
        url: '/recuperar_contraseña',
        template: '<ctz-recover-password layout-fill/>'
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
            .state('app.s.students.profile.password', {
              url: '/editar_contraseña?afterSaveRedirectTo',
              template: '<ctz-student-profile-password after-save="$ctrl.afterSave()" layout-fill/>',
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
            .state('app.s.teachers.profile.addresses', {
              url: '/direcciones',
              template: '<ctz-teacher-profile-addresses layout-fill/>',
            })
            .state('app.s.teachers.profile.address', {
              url: '/direcciones/editar?id',
              template: '<ctz-teacher-profile-address-form id="id" layout-fill/>',
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
