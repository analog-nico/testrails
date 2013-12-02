Testrails.module('Model.Definition', function (Definition, App, Backbone, Marionette, $, _) {
    
    // TODO: Refactor direct models access in case event handling is needed.
    // See: http://stackoverflow.com/questions/6256360/how-do-i-replace-a-model-in-a-backbone-collection
    // TODO: Currently, _byId cannot be used.
    Definition.Array = Backbone.Collection.extend({
        
        add: function (model, options) {
            return this.addAtIndex(this.length, model, options);
        },
        
        addAtIndex: function (index, model, options) {
            if (index < 0) index = 0;
            for ( var i = this.length; i > index; i-- ) {
                this.models[i] = this.models[i-1];
            }
            this.models[index] = model;
            this.length++;
            return model;
        },
        
        removeIndex: function (index, options) {
            var removedModel = this.models[i];
            for ( var i = index; i < this.length-1; i++) {
                this.models[i] = this.models[i+1];
            }
            this.pop();
            return removedModel;
        },
        
        replaceIndex: function (index, model, options) {
            var replacedModel = this.models[index];
            this.models[index] = model;
            return replacedModel;
        }
        
    });
    
    /*
     *  A SensorReading is created once a sensor of a sattelite observed the occurrence of a
     *  certain SystemActivity.
     */
    Definition.SensorReading = Backbone.Model.extend({
        defaults: {
            timestamp: null,
            data: null,
            
            forSystemActivity: null,
            forSensorReadingSequence: null
        },
        
        initialize: function () {
            this.set('data', {});
        }
    });
    
    // TODO: Testrails should manage a SensorReadingList which holds all SensorReadings which were not associated to a ReadingSequence for inspection by the tester.
    Definition.SensorReadingList = Backbone.Collection.extend({
        model: Definition.SensorReading
    });
    
    
    /*
     *  Holds SensorReadings in the linear order of their occurence which are related according
     *  to the SensorReadingSequenceOutline.
     */
    Definition.SensorReadingSequence = Backbone.Model.extend({
        defaults: {
            outline: null, // SensorReadingSequenceOutline
            sensorReadings: null, // SensorReadingList
            inProgress: true,
            
            /*
             *  Attributes that characterize the SensorReadingInstance and help the user to
             *  distinguish it from others.
             *
             *  The attribute data is collected from the data of the SensorReadings as
             *  defined in the SensorReadingSequenceOutline. For example if a SensorReadingSequence
             *  follows alongs a user from login to logout one attribute should be the user id.
             */
            characteristics: null // Key value pairs
        },
        
        initialize: function () {
            
            var sensorReadingList = new Definition.SensorReadingList();
            this.set('sensorReadings', sensorReadingList);
            
            // Bubble up events of sensorReadings collection
            var self = this;
            sensorReadingList.on('all', function (event, model, collection, options) {
                self.trigger('change', this, {});
            });
            
            this.set('characteristics', {});
        },
        
        getLabel: function () {
            var label = String();
            $.each(this.get('characteristics'), function (key, value) {
               label += key + ": " + value + "; "; 
            });
            return label.length >= 2 ? label.substring(0, label.length-2) : label;
        }
    });
    
    Definition.SensorReadingSequenceList = Backbone.Collection.extend({
        model: Definition.SensorReadingSequence
    });
    
    
    /*
     *  DRAFT
     *  Provides a definition / logic of related SensorReadings.
     */
    Definition.SensorReadingSequenceOutline = Backbone.Model.extend({
        defaults: {
            // TODO: Introduce a correlation machanism to allow the assignment of single SensorReadings to a ReadingSequence
            //       E.g. from login to logout of a user will use the user id as the correlation key.
            //       E.g. from the start to the end of a workflow (in a workflow system) will use the workflow id as the correlation id.
            
            // E.g. the login of a user
            startActivities: null,
            // E.g. the logout of a user
            endActivities: null
        }
    });
    
    Definition.SensorReadingSequenceOutlineList = Backbone.Collection.extend({
        model: Definition.SensorReadingSequenceOutline
    });
    
    
    /*
     *  Provides a difinition / logic for a system activity that may be observed by a sensor of
     *  a satellite.
     *  
     *  It may represent an actitivity like the response of the system under test e.g. that only
     *  1 free room is available for booking or that the system under test changed states /
     *  reached a state e.g. that no free rooms are available for booking.
     */
    // TODO: Should system state changes be handled seperately since their exact timestamp of
    //       of occurence does not matter? A hotel might have no free room just recently or for
    //       a long time.
    Definition.SystemActivity = Backbone.Model.extend({
        defaults: {
            name: '',
            identificationRule: null
        }
    });
    
    Definition.SystemActivityList = Backbone.Collection.extend({
        model: Definition.SystemActivity
    });
    
    
    /*
     *  DRAFT
     */
    Definition.SystemActivityIdentificationRule = Backbone.Model.extend({
        defaults: {
            version: 1
            // TODO: Actual definition / logic
        }
    });
    
    
    /*
     *  DRAFT
     *  Provides a definition / logic for marking a part of a SensorReadingSequence to
     *  represent a certain usage sceanrio.
     */
    Definition.UsageScenarioIdentificationRule = Backbone.Model.extend({
        defaults: {
            name: '',
            
            startActivities: null,
            endActivities: null,
            
            /*  If a SensorReading occurs for one of the start activities this UsageScenario
                may be in progress. However, only if the identification rule evaluates to true
                before one of the end activities are read then the part of the ReadingSequence
                is classified as this UsageScenario.
            */
            identificationRule: null
        }
    });
    
});