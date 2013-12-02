Testrails.module('Simulator.View', function (View, App, Backbone, Marionette, $, _) {
    
    View.MainView = Marionette.ItemView.extend({
        template: '#trs-sim-tmpl-mainview',
        tagName: 'div',
        className: 'trs-base-sidebar-container',
        
        ui: {
            inputSrsCKey: '#trs-eventsim-srs-ckey',
            inputSrsCVal: '#trs-eventsim-srs-cval',
            containerSrsList: '#trs-eventsim-srs-list',
            containerSrsSelect: '#trs-sim-srs-select',
            inputSaName: '#trs-sim-sa-name',
            containerSaList: '#trs-eventsim-sa-list',
            containerSaSelect: '#trs-sim-sa-select'
        },
        
        events: {
            'keypress #trs-eventsim-srs-ckey': 'onStartSensorReadingSequenceKeypress',
            'keypress #trs-eventsim-srs-cval': 'onStartSensorReadingSequenceKeypress',
            'click .trs-eventsim-srs-start': 'onStartSensorReadingSequence',
            'keypress #trs-sim-sa-name': 'onAddSystemActivityKeypress',
            'click .trs-sim-sa-add': 'onAddSystemActivity',
            'click .trs-sim-sr-add': 'onAddSensorReading'
        },
        
        onStartSensorReadingSequenceKeypress: function (e) {
            if (e.which !== 13) return;
            this.onStartSensorReadingSequence();
        },
        
        onStartSensorReadingSequence: function () {
            var characteristicsKey = this.ui.inputSrsCKey.val().trim();
            var characteristicsValue = this.ui.inputSrsCVal.val().trim();
            if (characteristicsKey == "" || characteristicsValue == "") return;
            
            var sensorReadingSequence = new App.Model.Definition.SensorReadingSequence();
            var newCharacteristics = {};
            newCharacteristics[characteristicsKey] = characteristicsValue;
            sensorReadingSequence.set('characteristics', newCharacteristics);
            App.Model.sensorReadingSequences.add(sensorReadingSequence);
            
            this.ui.inputSrsCKey.val('');
            this.ui.inputSrsCVal.val('');
            this.ui.inputSrsCKey.focus();
        },
        
        onAddSystemActivityKeypress: function (e) {
            if (e.which !== 13) return;
            this.onAddSystemActivity();
        },
        
        onAddSystemActivity: function () {
            var systemActivityName = this.ui.inputSaName.val().trim();
            if (systemActivityName == "") return;
            
            var systemActivity = new App.Model.Definition.SystemActivity();
            systemActivity.set('name', systemActivityName);
            App.Model.systemActivities.add(systemActivity);
            
            this.ui.inputSaName.val('');
            this.ui.inputSaName.focus();
        },
        
        onAddSensorReading: function () {
            var sensorReadingSequenceCid = this.ui.containerSrsSelect.val();
            var systemActivityCid = this.ui.containerSaSelect.val();
            if (sensorReadingSequenceCid == null || systemActivityCid == null) return;
            
            var sensorReadingSequence = App.Model.sensorReadingSequences.get(sensorReadingSequenceCid);
            var systemActivity = App.Model.systemActivities.get(systemActivityCid);
            
            var sensorReading = new App.Model.Definition.SensorReading();
            sensorReading.set('timestamp', Date.now());
            sensorReading.set('forSystemActivity', systemActivity);
            sensorReading.set('forSensorReadingSequence', sensorReadingSequence);
            sensorReadingSequence.get('sensorReadings').add(sensorReading);
            
        },
        
        updateSensorReadingSequenceTable: function () {
            this.ui.containerSrsList.html(_.template(
                $('#trs-sim-tmpl-srslist').html(),
                { sensorReadingSequences: App.Model.sensorReadingSequences }
            ));
        },
        
        updateSensorReadingSequenceSelect: function () {
            this.ui.containerSrsSelect.html(_.template(
                $('#trs-sim-tmpl-srssel').html(),
                { sensorReadingSequences: App.Model.sensorReadingSequences }
            ));
        },
        
        updateSystemActivityTable: function () {
            this.ui.containerSaList.html(_.template(
                $('#trs-sim-tmpl-salist').html(),
                { systemActivities: App.Model.systemActivities }
            ));
        },
        
        updateSystemActivitySelect: function () {
            this.ui.containerSaSelect.html(_.template(
                $('#trs-sim-tmpl-sasel').html(),
                { systemActivities: App.Model.systemActivities }
            ));
        }
    });
    
    View.addInitializer(function () {
        
        var mainView = new View.MainView({
            templateHelpers: {
                label: "Event:"
            }
        });
        App.sidebar.show(mainView);
        
        this.listenTo(App.Model.sensorReadingSequences, 'all', function () {
            mainView.updateSensorReadingSequenceTable();
            mainView.updateSensorReadingSequenceSelect();
        });
        
        this.listenTo(App.Model.systemActivities, 'all', function () {
            mainView.updateSystemActivityTable();
            mainView.updateSystemActivitySelect();
        });
        
    });
    
});