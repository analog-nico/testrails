Testrails.module('Diagram.ScopeFilter', function (ScopeFilter, App, Backbone, Marionette, $, _) {
    
    ScopeFilter.onNewSensorReadingSequence = function (sensorReadingSequence) {
        // Just watch all SensorReadingSequences
        App.Diagram.Controller.watch(sensorReadingSequence, true);
    };
    
    ScopeFilter.addInitializer(function () {
        this.listenTo(App.Model.sensorReadingSequences, 'add', function (model, collection, options) {
            ScopeFilter.onNewSensorReadingSequence(model);
        });
    });
    
});