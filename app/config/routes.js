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
              template: '<ctz-student-profile-editor/>'
            })

        .state('app.authenticated.teachers', {
          url: '/profesores',
          abstract: true,
          template: '<ui-view/>'
        })
          .state('app.authenticated.teachers.list', {
            url: '/',
            resolve: {currentUser: getCurrentUserOrRedirect},
            template: 'LISTA DE PROFESORES'
          })
  ;
};
