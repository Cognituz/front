module.exports = (
  $stateProvider,
  $urlRouterProvider,
  $locationProvider,
  $urlMatcherFactoryProvider
) => {
  "ngInject";

  $urlMatcherFactoryProvider.strictMode(false)
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

      // Students namespace
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

      // Teachers
      .state('app.teachers', {
        url: '/profesores',
        abstract: true,
        template: '<ui-view/>'
      })
        .state('app.teachers.signIn', {
          url: '/ingresar',
          template: '<ctz-sign-in-form user-type="teacher" layout-fill/>'
        })
        .state('app.teachers.list', {
          url: '',
          template: 'LISTA DE PROFESORES'
        })
  ;
};
