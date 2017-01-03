module.exports =
  files:
    javascripts:
      joinTo:
        'vendor.js': /^(bower_components|(\/usr\/lib\/)?node_modules)/
        'app.js':    /^app\//
    stylesheets:
      joinTo:
        'vendor.css': /^(bower_components|(\/usr\/lib\/)?node_modules)/
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
      plugins: ["angularjs-annotate"]
    stylus:
      plugins: ['autoprefixer-stylus']

  npm:
    enabled: true
    styles:
      "angular":          ["angular-csp.css"]
      "angular-material": ["angular-material.min.css"]
      "normalize.css":    ["normalize.css"]
