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

      .state('app.authenticated', {
        url: '/s',
        abstract: true,
        resolve: {currentUser: getCurrentUserOrRedirect},
        template: '<ui-view layout-fill/>'
      })

        .state('app.authenticated.students', {
          url: '/estudiantes',
          abstract: true,
          template: '<ui-view layout-fill/>'
        })
          .state('app.authenticated.students.profile', {
            url: '/perfil',
            abstract: true,
            template: '<ui-view layout-fill/>'
          })
            .state('app.authenticated.students.profile.edit', {
              url: '/editar?afterSaveRedirectTo',
              template: '<ctz-student-profile-editor after-save="$ctrl.afterSave()" layout-fill/>',
              controllerAs: '$ctrl',
              controller: class  {
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

        .state('app.authenticated.teachers', {
          url: '/profesores',
          abstract: true,
          template: '<ui-view layout-fill/>'
        })
          .state('app.authenticated.teachers.profile', {
            url: '/perfil',
            abstract: true,
            template: '<ui-view layout-fill/>'
          })
            .state('app.authenticated.teachers.profile.edit', {
              url: '/editar',
              template: '<ctz-teacher-profile-editor layout-fill/>',
            })
          .state('app.authenticated.teachers.list', {
            url: '/',
            template: '<ctz-teacher-list/>'
          })
          .state('app.authenticated.teachers.show', {
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
