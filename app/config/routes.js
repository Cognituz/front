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
          $state.go('app.students.signIn');
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
        template: '<ctz-sign-in-form-preselector layout-fill/>'
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
        template: '<ui-view/>'
      })
        .state('app.students.signIn', {
          url: '/ingresar',
          template: '<ctz-sign-in-form user-type="student" layout-fill/>'
        })
        .state('app.students.signUp', {
          url: '/registrarse',
          template: '<ctz-sign-up-form user-type="student" layout-fill/>'
        })

      .state('app.teachers', {
        url: '/profesores',
        abstract: true,
        template: '<ui-view/>'
      })
        .state('app.teachers.signIn', {
          url: '/ingresar',
          template: '<ctz-sign-in-form user-type="teacher" layout-fill/>'
        })

      .state('app.authenticated', {
        url: '/s',
        abstract: true,
        resolve: {currentUser: getCurrentUserOrRedirect},
        template: '<ui-view/>'
      })

        .state('app.authenticated.students', {
          url: '/estudiantes',
          abstract: true,
          template: '<ui-view/>'
        })
          .state('app.authenticated.students.profile', {
            url: '/perfil',
            abstract: true,
            template: '<ui-view/>'
          })
            .state('app.authenticated.students.profile.edit', {
              url: '/editar',
              template: '<ctz-student-profile-editor student="currentUser"/>',
              controller: inject({resolves: ['currentUser']})
            })

        .state('app.authenticated.teachers', {
          url: '/profesores',
          abstract: true,
          template: '<ui-view/>'
        })
          .state('app.authenticated.teachers.list', {
            url: '/',
            template: 'LISTA DE PROFESORES'
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
