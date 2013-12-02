Testrails.module('Model', function (Model, App, Backbone, Marionette, $, _) {
    
    Model.addInitializer(function () {
        Model.systemActivities = new Model.Definition.SystemActivityList();
        Model.sensorReadingSequences = new Model.Definition.SensorReadingSequenceList();
    });
    
});