//@prepros-prepend ../plugins.js
//@prepros-append app.model.definition.js
//@prepros-append app.model.js
//@prepros-append simulator.view.js
//@prepros-append diagram.model.definition.js
//@prepros-append diagram.model.js
//@prepros-append diagram.layout.js
//@prepros-append diagram.view.js
//@prepros-append diagram.controller.js
//@prepros-append diagram.scopefilter.js
//@prepros-append app.start.js

var Testrails = new Backbone.Marionette.Application();

Testrails.addRegions({
    sidebar: '.trs-base-sidebar',
    diagram: '.trs-base-diagram'
});

Testrails.on('initialize:after', function () {
    Backbone.history.start();
});