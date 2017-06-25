module.exports =
  paths:
    public: process.env.PUBLIC_DIR || './public'
  files:
    javascripts:
      joinTo:
        'vendor.js': /^(bower_components|(\/usr\/lib\/)?node_modules|vendor)/
        'app.js':    /^app\//
    stylesheets:
      joinTo:
        'vendor.css': /^(bower_components|(\/usr\/lib\/)?node_modules|vendor)/
        'app.css':    /^app\//
      order:
        after: ['app/main.css']
    templates:
      joinTo: "app.js": /.+\.jade$/

  modules:
    autoRequire:
      'app.js': ['main']

  plugins:
    jade:
      options:
        pretty: true
    static_jade:
      extension: ".jade"
      path: [/app/]
    uglify:
      compress: true
    babel:
      presets: ["es2015", "es2016", "es2017"]
      plugins: ["angularjs-annotate", "transform-class-properties"]
    stylus:
      plugins: ['autoprefixer-stylus']

  npm:
    enabled: true
    styles:
      "angular":                    ["angular-csp.css"]
      "angular-material":           ["angular-material.min.css"]
      "normalize.css":              ["normalize.css"]
      "ng-material-datetimepicker": ["dist/material-datetimepicker.min.css"]
      "md-color-picker":            ["/dist/mdColorPicker.min.css"]
