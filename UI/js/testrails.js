// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

var Testrails = new Backbone.Marionette.Application();

Testrails.addRegions({
    sidebar: '.trs-base-sidebar',
    diagram: '.trs-base-diagram'
});

Testrails.on('initialize:after', function () {
    Backbone.history.start();
});
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
Testrails.module('Model', function (Model, App, Backbone, Marionette, $, _) {
    
    Model.addInitializer(function () {
        Model.systemActivities = new Model.Definition.SystemActivityList();
        Model.sensorReadingSequences = new Model.Definition.SensorReadingSequenceList();
    });
    
});
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
Testrails.module('Diagram.Model.Definition', function (Definition, App, Backbone, Marionette, $, _) {
    
    Definition.SystemActivityNode = Backbone.Model.extend({
        defaults: {
            position: {
                left: -1,
                top: -1
            },
            $el: null,
            
            gridPosition: {
                column: -1,
                row: -1
            },
            
            predecessorNodes: null,
            successorNodes: null,
            
            incomingConnections: null,
            outgoingConnections: null,
            
            sensorReadings: null,
            systemActivity: null
        },
        
        initialize: function () {
            this.set('predecessorNodes', new Definition.SystemActivityNodeList());
            this.set('successorNodes', new Definition.SystemActivityNodeList());
            this.set('incomingConnections', new Definition.ConnectionList());
            this.set('outgoingConnections', new Definition.ConnectionList());
            this.set('sensorReadings', new App.Model.Definition.SensorReadingList());
        }
    });
    
    Definition.SystemActivityNodeList = Backbone.Collection.extend({
        model: Definition.SystemActivityNode
    });
    
    
    Definition.Connection = Backbone.Model.extend({
        defaults: {
            $el: null,
            paper: null,
            
            sourceNode: null,
            targetNode: null
        },
        
        initialize: function () {
        },
        
        getFirstHorizonalLaneRow: function () {
            if (!this.get('sourceNode')) return -1;
            var sourceNodeRow = this.get('sourceNode').get('gridPosition').row;
            if (sourceNodeRow == -1) return -1;
            return sourceNodeRow + 1;
        },
        
        getFirstHorizonalLaneOffset: function () {
            if (!this.get('sourceNode')) return -1;
            var sourceNodeColumn = this.get('sourceNode').get('gridPosition').column;
            var firstHorizontalLaneRow = this.getFirstHorizonalLaneRow();
            if (sourceNodeColumn == -1 || firstHorizontalLaneRow == -1) return -1;
            
            var cell = App.Diagram.Model.nodeCellGrid.at(sourceNodeColumn).at(firstHorizontalLaneRow);
            var offset = cell.getHorizontalLaneOffset(this);
            var count = cell.getHorizontalLaneCount();
            return {
                fromTop: offset,
                fromBottom: count - offset - 1
            };
        },
        
        getFirstHorizontalLineLength: function () {
            if (!this.get('sourceNode') || !this.get('targetNode')) return 0;
            var sourceNodeColumn = this.get('sourceNode').get('gridPosition').column;
            var targetNodeColumn = this.get('targetNode').get('gridPosition').column;
            var sourceNodeRow = this.get('sourceNode').get('gridPosition').row;
            var targetNodeRow = this.get('targetNode').get('gridPosition').row;
            
            if (targetNodeColumn - sourceNodeColumn == 0 && targetNodeRow - sourceNodeRow == 1) {
                // Straight connection to the node below
                return 0;
                
            } else if (targetNodeColumn - sourceNodeColumn == 0 && targetNodeRow - sourceNodeRow != 1) {
                // Only moving vertically
                return 1;
                
            } else if (targetNodeColumn - sourceNodeColumn > 0) {
                // One or more columns to the right
                return targetNodeColumn - sourceNodeColumn;
                
            } else if (targetNodeColumn - sourceNodeColumn < 0) {
                // One or more columns to the left
                return targetNodeColumn - sourceNodeColumn;
                
            }
        },
        
        getVerticalLaneColumn: function () {
            if (!this.get('sourceNode') || !this.get('targetNode')) return 0;
            var sourceNodeColumn = this.get('sourceNode').get('gridPosition').column;
            var targetNodeColumn = this.get('targetNode').get('gridPosition').column;
            if (sourceNodeColumn == -1 || targetNodeColumn == -1) return -1;
            
            if (targetNodeColumn - sourceNodeColumn <= 0) {
                return targetNodeColumn;
            } else if (targetNodeColumn - sourceNodeColumn > 0) {
                return targetNodeColumn - 1;
            }
        },
        
        getVerticalLaneOffset: function () {
            if (!this.get('sourceNode') || !this.get('targetNode')) return 0;
            var sourceNodeColumn = this.get('sourceNode').get('gridPosition').column;
            var targetNodeColumn = this.get('targetNode').get('gridPosition').column;
            var sourceNodeRow = this.get('sourceNode').get('gridPosition').row;
            var targetNodeRow = this.get('targetNode').get('gridPosition').row;
            
            if (targetNodeColumn - sourceNodeColumn == 0 && targetNodeRow - sourceNodeRow == 1) {
                // Straight connection to the node below
                return { fromLeft: 0, fromRight: 0 };
                
            } else if (targetNodeColumn - sourceNodeColumn != 0 && targetNodeRow - sourceNodeRow == 1) {
                // Not moving vertically
                return { fromLeft: 0, fromRight: 0 };
                
            } else if (targetNodeRow - sourceNodeRow > 1) {
                // Arriving from top
                var cell = App.Diagram.Model.nodeCellGrid.at(this.getVerticalLaneColumn()).at(targetNodeRow - 1);
                var offset = cell.getVerticalLaneOffset(this);
                var count = cell.getVerticalLaneCount();
                return {
                    fromLeft: offset,
                    fromRight: count - offset - 1
                };
                
            } else if (targetNodeRow - sourceNodeRow < 1) {
                // Arriving from bottom / same row (includes loop to itself)
                var cell = App.Diagram.Model.nodeCellGrid.at(this.getVerticalLaneColumn()).at(targetNodeRow);
                var offset = cell.getVerticalLaneOffset(this);
                var count = cell.getVerticalLaneCount();
                return {
                    fromLeft: offset,
                    fromRight: count - offset - 1
                };
                
            }
        },
        
        getVerticalLineLength: function () {
            if (!this.get('sourceNode') || !this.get('targetNode')) return 0;
            var sourceNodeColumn = this.get('sourceNode').get('gridPosition').column;
            var targetNodeColumn = this.get('targetNode').get('gridPosition').column;
            var sourceNodeRow = this.get('sourceNode').get('gridPosition').row;
            var targetNodeRow = this.get('targetNode').get('gridPosition').row;
            
            if (targetNodeColumn - sourceNodeColumn == 0 && targetNodeRow - sourceNodeRow == 1) {
                // Straight connection to the node below
                return 0;
                
            } else if (targetNodeColumn - sourceNodeColumn != 0 && targetNodeRow - sourceNodeRow == 1) {
                // Not moving vertically
                return 0;
                
            } else if (targetNodeRow - sourceNodeRow < 1) {
                // Moving upwards
                return targetNodeRow - sourceNodeRow - 1;
                
            } else if (targetNodeRow - sourceNodeRow > 1) {
                // Moving downwards
                return targetNodeRow - sourceNodeRow - 1;
                
            }
        },
        
        getSecondHorizontalLaneRow: function () {
            if (!this.get('targetNode')) return -1;
            var targetNodeRow = this.get('targetNode').get('gridPosition').row;
            if (targetNodeRow == -1) return -1;
            return targetNodeRow;
        },
        
        getSecondHorizontalLaneOffset: function () {
            if (!this.get('targetNode')) return -1;
            var targetNodeColumn = this.get('targetNode').get('gridPosition').column;
            var secondHorizontalLaneRow = this.getSecondHorizontalLaneRow();
            if (targetNodeColumn == -1 || secondHorizontalLaneRow == -1) return -1;
            
            var cell = App.Diagram.Model.nodeCellGrid.at(targetNodeColumn).at(secondHorizontalLaneRow);
            var offset = cell.getHorizontalLaneOffset(this);
            var count = cell.getHorizontalLaneCount();
            return {
                fromTop: offset,
                fromBottom: count - offset - 1
            };
        },
        
        getSecondHorizontalLineLength: function () {
            if (!this.get('sourceNode') || !this.get('targetNode')) return 0;
            var sourceNodeColumn = this.get('sourceNode').get('gridPosition').column;
            var targetNodeColumn = this.get('targetNode').get('gridPosition').column;
            var sourceNodeRow = this.get('sourceNode').get('gridPosition').row;
            var targetNodeRow = this.get('targetNode').get('gridPosition').row;
            
            if (targetNodeColumn - sourceNodeColumn == 0 && targetNodeRow - sourceNodeRow == 1) {
                // Straight connection to the node below
                return 0;
                
            } else {
                var verticalLaneColumn = this.getVerticalLaneColumn();
                if (verticalLaneColumn - targetNodeColumn == 0) {
                    return -1;
                } else if (verticalLaneColumn - targetNodeColumn == -1) {
                    return 1;
                }
                /* < -1 or > 0 is impossible as connections always move horizontally first. */
            }
        }
    });
    
    Definition.ConnectionList = Backbone.Collection.extend({
        model: Definition.Connection
    });
    
    
    /*
     *  A node cell represents a tile in the diagram layout containing one SystemActivityNode
     *  and the connections which go in or out of the node or just pass by.
     *
     *  ______________|______________
     *  |             |\            |
     *  -----*--------|-*---------> |
     *  |     \       |             |
     *  | - - | - - - | - - - - - - |
     *  |     |      /|             |
     *  | <---|-----*-|--------*-----
     *  |     |       |       /     |
     *  |_____|_______|_______|_____|________
     *  |     v       v       v     |   |   |
     *  |                           |   |   |
     *  |                           | ^ | | |
     *  |       Container for       |/|\| | |
     *  |     SystemActivityNode    | | |\|/|
     *  |                           | | | v |
     *  |                           |   |   |
     *  |___________________________|___|___|
     *
     */
    Definition.NodeCell = Backbone.Model.extend({
        defaults: {
            systemActivityNode: null,
            connectionsTopToRight: null,
            connectionsTopToLeft: null,
            connectionsRightToTop: null,
            connectionsRightToBottom: null
        },
        
        initialize: function () {
            this.set('connectionsTopToRight', new App.Model.Definition.Array());
            this.set('connectionsTopToLeft', new App.Model.Definition.Array());
            this.set('connectionsRightToTop', new App.Model.Definition.Array());
            this.set('connectionsRightToBottom', new App.Model.Definition.Array());
        },
        
        isOccupied: function () {
            return this.get('systemActivityNode') != null;
        },
        
        getHorizontalLaneOffset: function (connection) {
            var offset = this.get('connectionsTopToRight').indexOf(connection);
            if (offset != -1) return offset;
            offset = this.get('connectionsTopToLeft').indexOf(connection);
            if (offset == -1) return -1;
            return offset + this.get('connectionsTopToRight').length;
        },
        
        getHorizontalLaneCount: function () {
            return this.get('connectionsTopToRight').length + this.get('connectionsTopToLeft').length;
        },
        
        getVerticalLaneOffset: function (connection) {
            var offset = this.get('connectionsRightToTop').indexOf(connection);
            if (offset != -1) return offset;
            offset = this.get('connectionsRightToBottom').indexOf(connection);
            if (offset == -1) return -1;
            return offset + this.get('connectionsRightToTop').length;
        },
        
        getVerticalLaneCount: function () {
            return this.get('connectionsRightToTop').length + this.get('connectionsRightToBottom').length;
        },
        
        toString: function () {
            
            function fillWithSpaces(str, len) {
                for ( var i = str.length; i < len; i++ ) str += " ";
                return str;
            }
            
            var rightLanes = "| ";
            for ( var i = 0; i < this.get('connectionsRightToTop').length; i++ ) {
                if (i > 0) rightLanes += ", ";
                rightLanes += fillWithSpaces(this.get('connectionsRightToTop').at(i).cid, 4);
            }
            rightLanes += " | ";
            for ( var i = 0; i < this.get('connectionsRightToBottom').length; i++ ) {
                if (i > 0) rightLanes += ", ";
                rightLanes += fillWithSpaces(this.get('connectionsRightToBottom').at(i).cid, 4);
            }
            rightLanes += " |";
            
            var width = 19 + rightLanes.length;
            
            var str = fillWithSpaces("-------------------", width) + "\n";
            var strTemp = "";
            for ( var i = 0; i < this.get('connectionsTopToRight').length; i++ ) {
                if ( i > 0 ) strTemp += ",";
                strTemp += this.get('connectionsTopToRight').at(i).cid;
            }
            str += fillWithSpaces(strTemp, width) + "\n";
            str += fillWithSpaces("-------------------", width) + "\n";
            var strTemp = "";
            for ( var i = 0; i < this.get('connectionsTopToLeft').length; i++ ) {
                if ( i > 0 ) strTemp += ",";
                strTemp += this.get('connectionsTopToLeft').at(i).cid;
            }
            str += fillWithSpaces(strTemp, width) + "\n";
            str += fillWithSpaces("-------------------", width) + "\n";
            str += fillWithSpaces(
                    this.get('systemActivityNode') != null ? this.get('systemActivityNode').cid + " - " + this.get('systemActivityNode').get('systemActivity').get('name') : "",
                    19)
                + rightLanes;
            str += "\n\n";
            return str;
        }
    });
    
    Definition.NodeCellColumn = App.Model.Definition.Array.extend({
        model: Definition.NodeCell,
        
        getHeight: function () {
            return this.length;
        },
        
        getLastOccupiedCell: function () {
            var rowIndex = -1;
            for ( var i = this.getHeight()-1; i >= 0; i-- ) {
                if (this.at(i).isOccupied()) {
                    rowIndex = i;
                    break;
                }
            }
            return rowIndex;
        },
        
        moveCells: function (columnOffset, rowOffset, startIndex, endIndex) {
            
            if (columnOffset == 0 && rowOffset == 0) return;
            
            startIndex = startIndex || 0;
            startIndex = startIndex < 0 ? 0 : startIndex;
            endIndex = endIndex || this.getHeight() - 1;
            endIndex = endIndex > this.getHeight() - 1 ? this.getHeight() - 1 : endIndex;
            
            for ( var i = startIndex; i <= endIndex; i++ ) {
                var systemActivityNode = this.at(i).get('systemActivityNode');
                if (systemActivityNode == null) continue;
                
                var gridPosition = systemActivityNode.get('gridPosition');
                if (gridPosition.column == -1 || gridPosition.row == -1) continue;
                
                gridPosition.column += columnOffset;
                gridPosition.row += rowOffset;
                systemActivityNode.set('gridPosition', gridPosition);
            }
        },
        
        addVerticalLaneToTop: function () {
            for ( var i = 0; i < this.getHeight(); i++ ) {
                this.at(i).get('connectionsRightToTop').add(App.Diagram.Model.emptyLane);
            }
            return this.at(0).get('connectionsRightToTop').length - 1;
        },
        
        addVerticalLaneToBottom: function () {
            for ( var i = 0; i < this.getHeight(); i++ ) {
                this.at(i).get('connectionsRightToBottom').add(App.Diagram.Model.emptyLane);
            }
            return this.at(0).get('connectionsRightToBottom').length - 1;
        },
        
        removeVerticalLaneToTop: function (index) {
            for ( var i = 0; i < this.getHeight(); i++ ) {
                this.at(i).get('connectionsRightToTop').removeIndex(index);
            }
        },
        
        removeVerticalLaneToBottom: function (index) {
            for ( var i = 0; i < this.getHeight(); i++ ) {
                this.at(i).get('connectionsRightToBottom').removeIndex(index);
            }
        },
        
        addHorizontalLaneToRight: function (row) {
            this.at(row).get('connectionsTopToRight').add(App.Diagram.Model.emptyLane);
            return this.at(row).get('connectionsTopToRight').length - 1;
        },
        
        addHorizontalLaneToLeft: function (row) {
            this.at(row).get('connectionsTopToLeft').add(App.Diagram.Model.emptyLane);
            return this.at(row).get('connectionsTopToLeft').length - 1;
        },
        
        toString: function () {
            var str = "";
            for ( var i = 0; i < this.length; i++ ) {
                str += this.at(i).toString();
            }
            return str;
        }
    });
    
    Definition.NodeCellGrid = App.Model.Definition.Array.extend({
        model: Definition.NodeCellColumn,
        
        getWidth: function () {
            return this.length;
        },
        
        getHeight: function () {
            if (this.getWidth() == 0) return 0;
            return this.at(0).getHeight();
        },
        
        insertColumn: function (index) {
            
            var adjustConnections = true;
            if (index >= this.getWidth()) {
                index = this.getWidth();
                adjustConnections = false;
            }
            if (index <= 0) {
                index = 0;
                adjustConnections = false;
            }
            
            var gridWidth = this.getWidth();
            var columnHeight = this.getHeight();
            
            var newColumn = new Definition.NodeCellColumn();
            for ( var i = 0; i < columnHeight; i++ ) {
                var newNodeCell = new Definition.NodeCell();
                newColumn.add(newNodeCell);
                if (gridWidth > 0) {
                    var cellInSameRow = this.at(0).at(i);
                    var numConnectionsTopToRight = cellInSameRow.get('connectionsTopToRight').length;
                    for ( var k = 0; k < numConnectionsTopToRight; k++ ) {
                        newNodeCell.get('connectionsTopToRight').add(App.Diagram.Model.emptyLane);
                    }
                    var numConnectionsTopToLeft = cellInSameRow.get('connectionsTopToLeft').length;
                    for ( var k = 0; k < numConnectionsTopToLeft; k++ ) {
                        newNodeCell.get('connectionsTopToLeft').add(App.Diagram.Model.emptyLane);
                    }
                }
            }
            this.moveCells(1, 0, index);
            this.addAtIndex(index, newColumn);
            
            if (adjustConnections) {
                var columnToLeft = this.at(index-1);
                var columnToRight = this.at(index+1);
                
                /*
                 *  Close the gap of horizontally moving connections without turning upwards or
                 *  downwards.
                 *
                 *
                 *  Cell  |      |      | New Cell |      |      |  Cell
                 *  ______|      |      |__________|      |      |______
                 *               |                        |
                 *   --------------x                    x------------->
                 *               |                        |
                 *  - - - - - - - - - - - - - - - - - - - - - - - - - - 
                 *               |                        |
                 *   <-------------x                    x--------------
                 *               |                        |
                 *  _______      |      ____________      |      _______
                 *  Cell  |      |      | New Cell |      |      |  Cell
                 */
                
                for (var i = 0; i < this.getHeight(); i++ ) {
                    var cellToLeft = columnToLeft.at(i);
                    var cellToRight = columnToRight.at(i);
                    var newCell = newColumn.at(i);
                    
                    var cellToLeftConnections = cellToLeft.get('connectionsTopToRight');
                    var cellToRightConnections = cellToRight.get('connectionsTopToRight');
                    var newCellConnections = newCell.get('connectionsTopToRight');
                    var numConnectionsTopToRight = cellToLeftConnections.length;
                    for ( var k = 0; k < numConnectionsTopToRight; k++ ) {
                        if (cellToLeftConnections.at(k).cid == cellToRightConnections.at(k).cid) {
                            newCellConnections.replaceIndex(k, cellToLeftConnections.at(k));
                        }
                    }
                    var cellToLeftConnections = cellToLeft.get('connectionsTopToLeft');
                    var cellToRightConnections = cellToRight.get('connectionsTopToLeft');
                    var newCellConnections = newCell.get('connectionsTopToLeft');
                    var numConnectionsTopToLeft = cellToLeftConnections.length;
                    for ( var k = 0; k < numConnectionsTopToLeft; k++ ) {
                        if (cellToLeftConnections.at(k).cid == cellToRightConnections.at(k).cid) {
                            newCellConnections.replaceIndex(k, cellToLeftConnections.at(k));
                        }
                    }
                }
                
                /*
                 *  Move vertically moving connections to the right which have their targetNode to
                 *  the right. Also adjust the gap of the horizontal line of the connections that
                 *  come up.
                 *
                 *
                 *  _______      |  |   ____________             ____________
                 *  Cell  |         |   | New Cell |      |      |   Cell   |
                 *  ______|      |  |   |__________|             |__________|
                 *                  |                     |
                 *               |  |_______________________________
                 *            _____________________________________|
                 *  _______   |         ____________             __|_________
                 *  Cell  |   |  |      | New Cell |      |      | v Cell   |
                 *  ______|   |         |__________|             |__________|
                 *            |  |                        |
                 *            |                            
                 *            |  |                        |
                 *  _______   |         ____________             ____________
                 *  Cell  |   |  |      | New Cell |      |      |   Cell   |
                 *  ______|   |         |__________|             |__________|
                 */
                
                for (var i = 0; i < this.getHeight(); i++ ) {
                    var cellToLeft = columnToLeft.at(i);
                    var cellToRight = columnToRight.at(i);
                    var newCell = newColumn.at(i);
                    
                    var cellToLeftConnections = cellToLeft.get('connectionsRightToTop');
                    var numConnectionsRightToTop = cellToLeftConnections.length;
                    for ( var k = 0; k < numConnectionsRightToTop; k++ ) {
                        if (cellToLeftConnections.at(k).get('targetNode').get('gridPosition').column < index) {
                            continue;
                        }
                        // Move connection to the right
                        var indexNewLane = newColumn.addVerticalLaneToTop();
                        var connectionInLastLane = null;
                        for ( m = 0; m < columnToLeft.getHeight(); m++ ) {
                            var laneContent = columnToLeft.at(m).get('connectionsRightToTop').at(k);
                            if (laneContent.cid == App.Diagram.Model.emptyLane.cid) {
                                if (connectionInLastLane != null) {
                                    // Close gap in horizontal line
                                    var horizontalLines = columnToLeft.at(m).get('connectionsTopToRight');
                                    for ( p = 0; p < horizontalLines.length; p++ ) {
                                        if (horizontalLines.at(p).cid == connectionInLastLane.cid) {
                                            newColumn.at(m).get('connectionsTopToRight').replaceIndex(p, connectionInLastLane);
                                            break;
                                        }
                                    }
                                }
                                connectionInLastLane = null;
                                continue;
                            }
                            newColum.at(m).get('connectionsRightToTop').replaceIndex(indexNewLane, laneContent);
                            connectionInLastLane = laneContent;
                        }
                        columnToLeft.removeVerticalLaneToTop(k);
                    }
                    var cellToLeftConnections = cellToLeft.get('connectionsRightToBottom');
                    var numConnectionsRightToBottom = cellToLeftConnections.length;
                    for ( var k = 0; k < numConnectionsRightToBottom; k++ ) {
                        if (cellToLeftConnections.at(k).get('targetNode').get('gridPosition').column < index) {
                            continue;
                        }
                        // Move connection to the right
                        var indexNewLane = newColumn.addVerticalLaneToBottom();
                        var connectionInLastLane = null;
                        for ( m = 0; m < columnToLeft.getHeight(); m++ ) {
                            var laneContent = columnToLeft.at(m).get('connectionsRightToBottom').at(k);
                            if (laneContent.cid == App.Diagram.Model.emptyLane.cid) {
                                connectionInLastLane = null;
                                continue;
                            }
                            newColum.at(m).get('connectionsRightToBottom').replaceIndex(indexNewLane, laneContent);
                            if (connectionInLastLane == null) {
                                // Close gap in horizontal line
                                var horizontalLines = columnToLeft.at(m).get('connectionsTopToRight');
                                for ( p = 0; p < horizontalLines.length; p++ ) {
                                    if (horizontalLines.at(p).cid == laneContent.cid) {
                                        newColumn.at(m).get('connectionsTopToRight').replaceIndex(p, laneContent);
                                        break;
                                    }
                                }
                            }
                            connectionInLastLane = laneContent;
                        }
                        columnToLeft.removeVerticalLaneToBottom(k);
                    }
                }
            }
        },
        
        insertRow: function (index) {
            
            var adjustConnections = true;
            if (index >= this.getHeight()) {
                index = this.getHeight();
                adjustConnections = false;
            }
            if (index < 0) {
                index = 0;
                adjustConnections = false;
            }
            
            var gridHeight = this.getHeight();
            var rowWidth = this.getWidth();
            
            for ( var i = 0; i < rowWidth; i++ ) {
                var nodeCellColumn = this.at(i);
                var newNodeCell = new Definition.NodeCell();
                if (gridHeight > 0) {
                    var numRightToTopLanes = nodeCellColumn.at(0).get('connectionsRightToTop').length;
                    for ( var k = 0; k < numRightToTopLanes; k++ ) {
                        newNodeCell.get('connectionsRightToTop').add(App.Diagram.Model.emptyLane);
                    }
                    var numRightToBottomLanes = nodeCellColumn.at(0).get('connectionsRightToBottom').length;
                    for ( var k = 0; k < numRightToBottomLanes; k++ ) {
                        newNodeCell.get('connectionsRightToBottom').add(App.Diagram.Model.emptyLane);
                    }
                }
                nodeCellColumn.addAtIndex(index, newNodeCell);
            }
            this.moveCells(0, 1, 0, rowWidth-1, index + 1);
            
            if (adjustConnections) {
                // TODO
            }
            
        },
        
        moveCells: function (columnOffset, rowOffset, startIndexColumn, endIndexColumn, startIndexRow, endIndexRow) {
            startIndexColumn = startIndexColumn || 0;
            startIndexColumn = startIndexColumn < 0 ? 0 : startIndexColumn;
            endIndexColumn = endIndexColumn || this.getWidth() - 1;
            endIndexColumn = endIndexColumn > this.getWidth() - 1 ? this.getWidth() - 1 : endIndexColumn;
            
            for ( var i = startIndexColumn; i <= endIndexColumn; i++ ) {
                this.at(i).moveCells(columnOffset, rowOffset, startIndexRow, endIndexRow);
            }
        },
        
        addVerticalLaneToTop: function (column) {
            return this.at(column).addVerticalLaneToTop();
        },
        
        addVerticalLaneToBottom: function (column) {
            return this.at(column).addVerticalLaneToBottom();
        },
        
        addHorizontalLaneToRight: function (row) {
            var indexNewLane;
            for ( var i = 0; i < this.getWidth(); i++ ) {
                var tmp = this.at(i).addHorizontalLaneToRight(row);
                if (i == 0) {
                    indexNewLane = tmp;
                } else {
                    if (tmp != indexNewLane) throw "Internal error.";
                }
            }
            return indexNewLane;
        },
        
        addHorizontalLaneToLeft: function (row) {
            var indexNewLane;
            for ( var i = 0; i < this.getWidth(); i++ ) {
                var tmp = this.at(i).addHorizontalLaneToLeft(row);
                if (i == 0) {
                    indexNewLane = tmp;
                } else {
                    if (tmp != indexNewLane) throw "Internal error.";
                }
            }
            return indexNewLane;
        },
        
        getCellAbove: function (gridPosition) {
            return this.getCell({ column: gridPosition.column, row: gridPosition.row - 1 });
        },
        
        getCellBelow: function (gridPosition) {
            return this.getCell({ column: gridPosition.column, row: gridPosition.row + 1 });
        },
        
        getCellToLeft: function (gridPosition) {
            return this.getCell({ column: gridPosition.column - 1, row: gridPosition.row });
        },
        
        getCellToRight: function (gridPosition) {
            return this.getCell({ column: gridPosition.column + 1, row: gridPosition.row });
        },
        
        getCell: function (gridPosition) {
            if (gridPosition.column < 0 || gridPosition.row < 0) return null;
            if (gridPosition.column >= this.getWidth()) return null;
            if (gridPosition.row >= this.getHeight()) return null;
            return this.at(gridPosition.column).at(gridPosition.row);
        },
        
        toString: function () {
            var strings = [];
            for ( var i = 0; i < this.length; i++ ) {
                strings[i] = this.at(i).toString().split("\n");
            }
            var str = ""
            for ( var i = 0; i < strings[0].length; i++) {
                str += "\n";
                for ( var k = 0; k < strings.length; k++ ) {
                    str += strings[k][i];
                }
            }
            return str;
        }
    });
    
});
Testrails.module('Diagram.Model', function (Model, App, Backbone, Marionette, $, _) {
    
    Model.findNodeForSystemActivity = function (systemActivity) {
        return Model.systemActivityNodes.find(function (systemActivityNode) {
                return systemActivityNode.get('systemActivity').cid == systemActivity.cid;
            });
    };
    
    Model.addInitializer(function () {
        Model.systemActivityNodes = new Model.Definition.SystemActivityNodeList();
        Model.nodeCellGrid = new Model.Definition.NodeCellGrid();
        Model.emptyLane = new Model.Definition.Connection();
    });
    
});
Testrails.module('Diagram.Layout', function (Layout, App, Backbone, Marionette, $, _) {
    
    Layout.placeIntoGrid = function (systemActivityNode) {
        
        if (systemActivityNode.get('position').left == -1 && systemActivityNode.get('position').top == -1) {
            // SystemActivityNode was newly created and must be inserted into the grid
            
            if (systemActivityNode.get('predecessorNodes').length == 0) {
                // This is the first node of a SensorReadingSequence
                
                App.Diagram.Model.nodeCellGrid.insertColumn(0);
                if (App.Diagram.Model.nodeCellGrid.getHeight() == 0) {
                    App.Diagram.Model.nodeCellGrid.insertRow(0);
                }
                App.Diagram.Model.nodeCellGrid.at(0).at(0).set('systemActivityNode', systemActivityNode);
                systemActivityNode.set('gridPosition', { column: 0, row: 0 });
                
            } else {
                
                var numColumnOfLatestPredecessor = systemActivityNode.get('predecessorNodes').last().get('gridPosition').column;
                var columnOfLatestPredecessor = App.Diagram.Model.nodeCellGrid.at(numColumnOfLatestPredecessor);
                var rowOfFreeCell = columnOfLatestPredecessor.getLastOccupiedCell() + 1;
                rowOfFreeCell = rowOfFreeCell > columnOfLatestPredecessor.getHeight() ? columnOfLatestPredecessor.getHeight() : rowOfFreeCell;
                
                if (rowOfFreeCell == columnOfLatestPredecessor.getHeight()) {
                    App.Diagram.Model.nodeCellGrid.insertRow(rowOfFreeCell);
                }
                
                columnOfLatestPredecessor.at(rowOfFreeCell).set('systemActivityNode', systemActivityNode);
                systemActivityNode.set('gridPosition', { column: numColumnOfLatestPredecessor, row: rowOfFreeCell });
                
                Layout.placeConnectionIntoGrid(systemActivityNode.get('predecessorNodes').last(), systemActivityNode);
                
            }
            
        } else {
            
            if (systemActivityNode.get('predecessorNodes').length > 0
                    && systemActivityNode.get('incomingConnections').last().get('$el') == null) {
                Layout.placeConnectionIntoGrid(systemActivityNode.get('predecessorNodes').last(), systemActivityNode);
            }
            
        }
        
    };
    
    Layout.placeConnectionIntoGrid = function (sourceNode, targetNode) {
        
        var connection = targetNode.get('incomingConnections').last();
        var indexLaneOfFirstHorizontalLine;
        var gridColumnForVerticalLine;
        
        var firstHorizontalLineLength = connection.getFirstHorizontalLineLength();
        if (firstHorizontalLineLength != 0) {
            var gridRow = connection.get('sourceNode').get('gridPosition').row + 1;
            var gridColumnStart = connection.get('sourceNode').get('gridPosition').column;
            var gridColumnEnd = gridColumnStart + firstHorizontalLineLength;
            
            gridColumnForVerticalLine = firstHorizontalLineLength > 0 ? gridColumnEnd - 1 : gridColumnEnd;
            
            if (App.Diagram.Model.nodeCellGrid.getHeight() == gridRow) {
                App.Diagram.Model.nodeCellGrid.insertRow(gridRow);
            }
            
            for ( var x = gridColumnStart; x != gridColumnEnd; firstHorizontalLineLength > 0 ? x++ : x-- ) {
                
                if (firstHorizontalLineLength > 0) {
                    indexLaneOfFirstHorizontalLine = App.Diagram.Model.nodeCellGrid.addHorizontalLaneToRight(gridRow);
                    App.Diagram.Model.nodeCellGrid.at(x).at(gridRow)
                        .get('connectionsTopToRight')
                        .replaceIndex(indexLaneOfFirstHorizontalLine, connection);
                } else {
                    indexLaneOfFirstHorizontalLine = App.Diagram.Model.nodeCellGrid.addHorizontalLaneToLeft(gridRow);
                    App.Diagram.Model.nodeCellGrid.at(x).at(gridRow)
                        .get('connectionsTopToLeft')
                        .replaceIndex(indexLaneOfFirstHorizontalLine, connection);
                }
            }
        }
        
        var verticalLineLength = connection.getVerticalLineLength();
        if (verticalLineLength != 0 && gridColumnForVerticalLine != null) {
            
            var indexNewLane = verticalLineLength > 0
                ? App.Diagram.Model.nodeCellGrid.addVerticalLaneToBottom(gridColumnForVerticalLine)
                : App.Diagram.Model.nodeCellGrid.addVerticalLaneToTop(gridColumnForVerticalLine);
            
            var gridRowStart = connection.get('sourceNode').get('gridPosition').row;
            if (verticalLineLength > 0) gridRowStart += 1;
            
            for ( var step = 0; step != verticalLineLength; verticalLineLength > 0 ? step++ : step-- ) {
                
                App.Diagram.Model.nodeCellGrid.at(gridColumnForVerticalLine).at(gridRowStart + step)
                    .get(verticalLineLength > 0 ? 'connectionsRightToBottom' : 'connectionsRightToTop')
                    .replaceIndex(indexNewLane, connection);
                
            }
        }
        
        var secondHorizontalLineLength = connection.getSecondHorizontalLineLength();
        if (secondHorizontalLineLength != 0) {
            var gridRow = connection.get('targetNode').get('gridPosition').row;
            var gridColumn = connection.get('targetNode').get('gridPosition').column;
            
            if (secondHorizontalLineLength > 0) {
                var indexLane = verticalLineLength != 0
                    ? App.Diagram.Model.nodeCellGrid.addHorizontalLaneToRight(gridRow)
                    : indexLaneOfFirstHorizontalLine;
                App.Diagram.Model.nodeCellGrid.at(gridColumn).at(gridRow)
                    .get('connectionsTopToRight')
                    .replaceIndex(indexLane, connection);
            } else {
                var indexLane = verticalLineLength != 0
                    ? App.Diagram.Model.nodeCellGrid.addHorizontalLaneToLeft(gridRow)
                    : indexLaneOfFirstHorizontalLine;
                App.Diagram.Model.nodeCellGrid.at(gridColumn).at(gridRow)
                    .get('connectionsTopToLeft')
                    .replaceIndex(indexLane, connection);
            }
        }
        
    };
    
});
Testrails.module('Diagram.View', function (View, App, Backbone, Marionette, $, _) {
    
    View.Constants = {
        nodeContainerHeight: 154,
        nodeContainerWidth: 264,
        nodeHeight: 84,
        nodeWidth: 200,
        horizontalLaneHeight: 40,
        verticalLaneWidth: 40,
        connectionCornerRadius: 40,
        connectionLineWidth: 6
    };
    
    View.Constants.nodeOffsetTop = (View.Constants.nodeContainerHeight - View.Constants.nodeHeight) / 2;
    View.Constants.nodeOffsetLeft = (View.Constants.nodeContainerWidth - View.Constants.nodeWidth) / 2;
    View.Constants.anchorOutgoingConnectionTop = View.Constants.nodeHeight;
    View.Constants.anchorOutgoingConnectionLeft = View.Constants.nodeWidth / 2;
    
    
    View.refresh = function () {
        var numColumns = App.Diagram.Model.nodeCellGrid.getWidth();
        var numRows = App.Diagram.Model.nodeCellGrid.getHeight();
        var columnWidths = [];
        var columnOffsets = [];
        var rowHeights = [];
        var rowOffsets = [];
        
        for ( var x = 0; x < numColumns; x++) {
            var column = App.Diagram.Model.nodeCellGrid.at(x);
            for ( var y = 0; y < numRows; y++ ) {
                var cell = column.at(y);
                
                if (y == 0) {
                    columnWidths[x] = cell.getVerticalLaneCount() * View.Constants.verticalLaneWidth + View.Constants.nodeContainerWidth;
                    columnOffsets[x] = x == 0 ? 0 : columnOffsets[x-1] + columnWidths[x-1];
                }
                if (x == 0) {
                    rowHeights[y] = cell.getHorizontalLaneCount() * View.Constants.horizontalLaneHeight + View.Constants.nodeContainerHeight;
                    rowOffsets[y] = y == 0 ? 0 : rowOffsets[y-1] + rowHeights[y-1];
                }
                
                var systemActivityNode = cell.get('systemActivityNode')
                if (systemActivityNode != null) {
                    
                    systemActivityNode.set('position', {
                        left: columnOffsets[x] + View.Constants.nodeOffsetLeft,
                        top: rowOffsets[y] + (cell.getHorizontalLaneCount() * View.Constants.horizontalLaneHeight) + View.Constants.nodeOffsetTop
                    });
                    
                    drawSystemActivityNode(systemActivityNode);
                    
                    // TODO: Update outgoing connections
                }
            }
        }
    };
    
    function drawSystemActivityNode(systemActivityNode) {
        
        // Draw the node
        var $el = systemActivityNode.get('$el');
        
        if ($el == null) {
            
            $el = $(_.template(
                $('#trs-diagram-tmpl-node').html(),
                { systemActivityNode: systemActivityNode }
            ));
            systemActivityNode.set('$el', $el);
            $(App.diagram.el).append($el);
            
        }
        
        // The incoming connection most recently added may be a new one
        if (systemActivityNode.get('incomingConnections').length == 0) return;
        var connection = systemActivityNode.get('incomingConnections').last();
        
        if (connection.get('$el') == null) {
            drawNewConnection(connection);
        }
        
    };
    
    function drawNewConnection(connection) {
        
        var svg = $('<svg id="conn' + connection.cid + '" class="trs-diagram-connection"></svg>').appendTo('.trs-base-diagram');
        connection.set('$el', svg);
        
        var s = Snap("#conn" + connection.cid);
        
        /* Start vertical Line */
        var sourceNode = connection.get('sourceNode');
        var startLeft = sourceNode.get('position').left + View.Constants.anchorOutgoingConnectionLeft;
        var startTop = sourceNode.get('position').top + View.Constants.anchorOutgoingConnectionTop;
        var firstHorizontalLineOffset = connection.getFirstHorizonalLaneOffset();
        var startHeight
            = View.Constants.nodeContainerHeight - View.Constants.nodeOffsetTop - View.Constants.nodeHeight
            + (firstHorizontalLineOffset.fromTop > 0 ? firstHorizontalLineOffset.fromTop * View.Constants.horizontalLaneHeight : 0);
        
        var svgPos = {
            left: startLeft,
            right: startLeft,
            top: startTop,
            bottom: startTop + startHeight
        }
        
        function expandArea(svgPos, point) {
            if (point.left < svgPos.left) svgPos.left = point.left;
            else if (point.left > svgPos.right) svgPos.right = point.left;
            if (point.top < svgPos.top) svgPos.top = point.top;
            else if (point.top > svgPos.bottom) svgPos.bottom = point.top;
            return svgPos;
        }
        
        /* First corner */
        var firstHorizontalLineSpan = connection.getFirstHorizontalLineLength();
        var firstCornerWidth
            = (firstHorizontalLineSpan > 0
                ? View.Constants.connectionCornerRadius
                : (firstHorizontalLineSpan < 0
                    ? View.Constants.connectionCornerRadius * -1
                    : 0));
        
        var firstCornerHeight
            = (firstHorizontalLineSpan == 0
                ? App.Diagram.Model.nodeCellGrid.getCellBelow(sourceNode.get('gridPosition'))
                    .getHorizontalLaneCount() * View.Constants.horizontalLaneHeight
                : View.Constants.connectionCornerRadius);
        
        if (firstHorizontalLineSpan != 0) startHeight -= firstCornerHeight / 2;
        
        svgPos = expandArea(svgPos, {
            left: startLeft + firstCornerWidth,
            top: startTop + startHeight + firstCornerHeight
        });
        
        /* First horizontal Line */
        var firstHorizontalLineLength = firstHorizontalLineSpan * View.Constants.nodeContainerWidth;
        
        if (firstHorizontalLineLength < 0) {
            firstHorizontalLineLength += View.Constants.nodeContainerWidth - View.Constants.nodeOffsetLeft - View.Constants.anchorOutgoingConnectionLeft + View.Constants.connectionCornerRadius;
            
            var row = sourceNode.get('gridPosition').row;
            for ( var column = sourceNode.get('gridPosition').column - 1, i = -2; i >= firstHorizontalLineSpan; column--, i-- ) {
                var verticalLaneCount = App.Diagram.Model.nodeCellGrid.at(column).at(row).getVerticalLaneCount();
                firstHorizontalLineLength -= verticalLaneCount * View.Constants.verticalLaneWidth;
            }
            
        } else if (firstHorizontalLineLength > 0) {
            firstHorizontalLineLength -= View.Constants.nodeOffsetLeft + View.Constants.anchorOutgoingConnectionLeft + View.Constants.connectionCornerRadius;
            
            var row = sourceNode.get('gridPosition').row;
            for ( var column = sourceNode.get('gridPosition').column, i = 1; i < firstHorizontalLineSpan; column++, i++ ) {
                var verticalLaneCount = App.Diagram.Model.nodeCellGrid.at(column).at(row).getVerticalLaneCount();
                firstHorizontalLineLength += verticalLaneCount * View.Constants.verticalLaneWidth;
            }
            
        }
        
        svgPos = expandArea(svgPos, {
            left: startLeft + firstCornerWidth + firstHorizontalLineLength,
            top: startTop + startHeight + firstCornerHeight
        });
        
        /* Second corner */
        var verticalLineSpan = connection.getVerticalLineLength();
        var verticalLineOffset = connection.getVerticalLaneOffset();
        var secondCornerWidth = 0;
        var secondCornerHeight = 0;
        
        if (verticalLineSpan != 0) {
            secondCornerHeight = verticalLineSpan > 0 ? View.Constants.connectionCornerRadius : View.Constants.connectionCornerRadius * -1;
            
            if (firstHorizontalLineLength < 0) {
                
                firstHorizontalLineLength -= verticalLineOffset.fromRight * View.Constants.verticalLaneWidth - View.Constants.verticalLaneWidth / 2;
                
                secondCornerWidth = View.Constants.connectionCornerRadius * -1;
                
            } else if (firstHorizontalLineLength > 0) {
                
                firstHorizontalLineLength += verticalLineOffset.fromLeft * View.Constants.verticalLaneWidth - View.Constants.verticalLaneWidth / 2;
                
                secondCornerWidth = View.Constants.connectionCornerRadius;
                
            }
            
        } else if (verticalLineSpan == 0 && firstHorizontalLineLength != 0) {
            
            secondCornerWidth
                = App.Diagram.Model.nodeCellGrid.at(connection.getVerticalLaneColumn()).at(0).getVerticalLaneCount()
                * View.Constants.verticalLaneWidth;
            
            if (firstHorizontalLineLength < 0) secondCornerWidth *= -1;
            
        }
        
        svgPos = expandArea(svgPos, {
            left: startLeft + firstCornerWidth + firstHorizontalLineLength + secondCornerWidth,
            top: startTop + startHeight + firstCornerHeight + secondCornerHeight
        });
        
        /* Middle vertical line */
        var verticalLineLength = verticalLineSpan * View.Constants.nodeContainerHeight;
        
        if (verticalLineSpan < 0) {
            
            verticalLineLength -= firstHorizontalLineOffset.fromTop * View.Constants.horizontalLaneHeight + (View.Constants.horizontalLaneHeight / 2 - View.Constants.connectionCornerRadius);
            
            var column = connection.getVerticalLaneColumn();
            for ( var row = sourceNode.get('gridPosition').row, i = -1; i > verticalLineSpan; row--, i-- ) {
                var horizontalLaneCount = App.Diagram.Model.nodeCellGrid.at(column).at(row).getHorizontalLaneCount();
                verticalLineLength -= horizontalLaneCount * View.Constants.horizontalLaneHeight;
            }
            
        } else if (verticalLineSpan > 0) {
            
            verticalLineLength += firstHorizontalLineOffset.fromBottom * View.Constants.horizontalLaneHeight + (View.Constants.horizontalLaneHeight / 2 - View.Constants.connectionCornerRadius);
            
            var column = connection.getVerticalLaneColumn();
            for ( var row = sourceNode.get('gridPosition').row + 2, i = 2; i <= verticalLineSpan; row++, i++ ) {
                var horizontalLaneCount = App.Diagram.Model.nodeCellGrid.at(column).at(row).getHorizontalLaneCount();
                verticalLineLength += horizontalLaneCount * View.Constants.horizontalLaneHeight;
            }
            
        }
        
        svgPos = expandArea(svgPos, {
            left: startLeft + firstCornerWidth + firstHorizontalLineLength + secondCornerWidth,
            top: startTop + startHeight + firstCornerHeight + secondCornerHeight + verticalLineLength
        });
        
        /* Third corner */
        var secondHorizontalLineOffset = connection.getSecondHorizontalLaneOffset();
        var secondHorizontalLineSpan = connection.getSecondHorizontalLineLength();
        
        var thirdCornerWidth
            = (verticalLineSpan != 0 && secondHorizontalLineSpan > 0
                ? View.Constants.connectionCornerRadius
                : (verticalLineSpan != 0 && secondHorizontalLineSpan < 0
                    ? View.Constants.connectionCornerRadius * -1
                    : 0));
        var thirdCornerHeight
            = (verticalLineSpan > 0
                ? View.Constants.connectionCornerRadius
                : (verticalLineSpan < 0
                    ? View.Constants.connectionCornerRadius * -1
                    : 0));
        
        if (verticalLineSpan < 0) {
            
            verticalLineLength -= secondHorizontalLineOffset.fromBottom * View.Constants.horizontalLaneHeight + View.Constants.horizontalLaneHeight / 2 - View.Constants.connectionCornerRadius;
            
        } else if (verticalLineSpan > 0) {
            
            verticalLineLength += secondHorizontalLineOffset.fromTop * View.Constants.horizontalLaneHeight + View.Constants.horizontalLaneHeight / 2 - View.Constants.connectionCornerRadius;
            
        }
        
        svgPos = expandArea(svgPos, {
            left: startLeft + firstCornerWidth + firstHorizontalLineLength + secondCornerWidth + thirdCornerWidth,
            top: startTop + startHeight + firstCornerHeight + secondCornerHeight + verticalLineLength + thirdCornerHeight
        });
        
        /* Second horizontal line */
        var secondHorizontalLineLength = 0;
        
        if (secondHorizontalLineSpan == -1) {
            
            secondHorizontalLineLength
                = (View.Constants.nodeContainerWidth - View.Constants.nodeWidth - View.Constants.nodeOffsetLeft
                + Math.round(View.Constants.nodeWidth / 4) - View.Constants.connectionCornerRadius) * -1;
            
            if (verticalLineSpan != 0) {
                secondHorizontalLineLength -= verticalLineOffset.fromLeft * View.Constants.verticalLaneWidth + View.Constants.verticalLaneWidth / 2 - View.Constants.connectionCornerRadius;
            }
            
        } else if (secondHorizontalLineSpan == 1) {
            
            secondHorizontalLineLength
                = View.Constants.nodeOffsetLeft
                + Math.round(View.Constants.nodeWidth / 4) - View.Constants.connectionCornerRadius;
            
            if (verticalLineSpan != 0) {
                secondHorizontalLineLength += verticalLineOffset.fromRight * View.Constants.verticalLaneWidth + View.Constants.verticalLaneWidth / 2 - View.Constants.connectionCornerRadius;
            }
            
        }
        
        svgPos = expandArea(svgPos, {
            left: startLeft + firstCornerWidth + firstHorizontalLineLength + secondCornerWidth + thirdCornerWidth + secondHorizontalLineLength,
            top: startTop + startHeight + firstCornerHeight + secondCornerHeight + verticalLineLength + thirdCornerHeight
        });
        
        /* Fourth corner */
        var fourthCornerWidth = 0;
        var fourthCornerHeight = 0;
        
        if (secondHorizontalLineSpan == -1) {
            
            fourthCornerWidth = View.Constants.connectionCornerRadius * -1;
            fourthCornerHeight = View.Constants.connectionCornerRadius;
            
        } else if (secondHorizontalLineSpan == 1) {
            
            fourthCornerWidth = View.Constants.connectionCornerRadius;
            fourthCornerHeight = View.Constants.connectionCornerRadius;
            
        }
        
        svgPos = expandArea(svgPos, {
            left: startLeft + firstCornerWidth + firstHorizontalLineLength + secondCornerWidth + thirdCornerWidth + secondHorizontalLineLength + fourthCornerWidth,
            top: startTop + startHeight + firstCornerHeight + secondCornerHeight + verticalLineLength + thirdCornerHeight + fourthCornerHeight
        });
        
        /* End vertical line */
        var endHeight = View.Constants.nodeOffsetTop;
        
        if (secondHorizontalLineSpan != 0) {
            
            endHeight += secondHorizontalLineOffset.fromBottom * View.Constants.horizontalLaneHeight + View.Constants.horizontalLaneHeight / 2 - View.Constants.connectionCornerRadius;
            
        }
        
        svgPos = expandArea(svgPos, {
            left: startLeft + firstCornerWidth + firstHorizontalLineLength + secondCornerWidth + thirdCornerWidth + secondHorizontalLineLength + fourthCornerWidth,
            top: startTop + startHeight + firstCornerHeight + secondCornerHeight + verticalLineLength + thirdCornerHeight + fourthCornerHeight + endHeight
        });
        
        /* SVG Path */
        svgPos.width = svgPos.right - svgPos.left;
        svgPos.height = svgPos.bottom - svgPos.top;
        
        var pathDescr
            = "M " + (startLeft - svgPos.left + View.Constants.connectionLineWidth / 2) + " " + (startTop - svgPos.top + View.Constants.connectionLineWidth / 2) + " "
            + "v " + startHeight + " "
            + (firstCornerWidth == 0 && firstCornerHeight == 0
                ? "c 0 0 0 0 0 0 "
                : "c 0 " + Math.round(firstCornerHeight * 0.55) + " " + Math.round(firstCornerWidth * 0.45) + " " + firstCornerHeight + " " + firstCornerWidth + " " + firstCornerHeight + " ")
            + "h " + firstHorizontalLineLength + " "
            + (secondCornerWidth == 0 && secondCornerHeight == 0
                ? "c 0 0 0 0 0 0 "
                : "c " + Math.round(secondCornerWidth * 0.55) + " 0 " + secondCornerWidth + " " + Math.round(secondCornerHeight * 0.45) + " " + secondCornerWidth + " " + secondCornerHeight + " ")
            + "v " + verticalLineLength + " "
            + (thirdCornerWidth == 0 && thirdCornerHeight == 0
                ? "c 0 0 0 0 0 0 "
                : "c 0 " + Math.round(thirdCornerHeight * 0.55) + " " + Math.round(thirdCornerWidth * 0.45) + " " + thirdCornerHeight + " " + thirdCornerWidth + " " + thirdCornerHeight + " ")
            + "h " + secondHorizontalLineLength + " "
            + (fourthCornerWidth == 0 && fourthCornerHeight == 0
                ? "c 0 0 0 0 0 0 "
                : "c " + Math.round(fourthCornerWidth * 0.55) + " 0 " + fourthCornerWidth + " " + Math.round(fourthCornerHeight * 0.45) + " " + fourthCornerWidth + " " + fourthCornerHeight + " ")
            + "v " + endHeight;
        
        // Consider line width of 6px
        svgPos.left -= View.Constants.connectionLineWidth / 2;
        svgPos.top -= View.Constants.connectionLineWidth / 2;
        svgPos.width += View.Constants.connectionLineWidth;
        svgPos.height += View.Constants.connectionLineWidth;
        
        svg.css({
            left: String(svgPos.left) + "px",
            top: String(svgPos.top) + "px",
            width: String(svgPos.width) + "px",
            height: String(svgPos.height) + "px"
        });
        
        var path = s.path(pathDescr);
        path.attr({
            stroke: "#363636",
            strokeWidth: 6,
            "fill-opacity": 0
        });
        
    }
    
    View.addInitializer(function () {
        App.Diagram.Model.systemActivityNodes.on('change:position', function (systemActivityNode, newValue, options) {
            $el = systemActivityNode.get('$el');
            if ($el == null) return;
            systemActivityNode.get('$el').animate({
                left: systemActivityNode.get('position').left + 'px',
                top: systemActivityNode.get('position').top + 'px'
            });
            
            // As long as we do not animate the connection we just redraw them
            for ( var i = 0; i < systemActivityNode.get('outgoingConnections').length; i++ ) {
                var connection = systemActivityNode.get('outgoingConnections').at(i);
                if (connection.get('$el') != null) {
                    connection.get('$el').remove();
                }
                drawNewConnection(connection);
            }
            for ( var i = 0; i < systemActivityNode.get('incomingConnections').length; i++ ) {
                var connection = systemActivityNode.get('incomingConnections').at(i);
                if (connection.get('$el') != null) {
                    connection.get('$el').remove();
                }
                drawNewConnection(connection);
            }
        });
    });
    
});
Testrails.module('Diagram.Controller', function (Controller, App, Backbone, Marionette, $, _) {
    
    Controller.watch = function (sensorReadingSequence, focus) {
        
        this.listenTo(sensorReadingSequence.get('sensorReadings'), 'add', function (sensorReading, sensorReadingList, options) {
            
            // Create / Update SensorReading Node as well as the connection -> View
            // Add SensorReading Node to grid and add / update connections and calculate new coordinates -> Layout
            // Paint new Node / Connection -> View
            //   \--> This will automatically move the existing nodes / connections
            
            var systemActivityNode = Controller.getSystemActivityNodeForSensorReading(sensorReading, sensorReadingList);
            App.Diagram.Layout.placeIntoGrid(systemActivityNode);
            App.Diagram.View.refresh();
            
        });
        
    };
    
    Controller.getSystemActivityNodeForSensorReading = function (sensorReading, sensorReadingList) {
        
        // Get preceeding SensorReading
        var predecessorSensorReading;
        var index = sensorReadingList.indexOf(sensorReading);
        if (index > 0) {
            predecessorSensorReading = sensorReadingList.at(index-1);
        }
        
        var systemActivityNode = App.Diagram.Model.findNodeForSystemActivity(sensorReading.get('forSystemActivity'));
        if (systemActivityNode == null) {
            
            // Create new SystemActivityNode
            systemActivityNode = new App.Diagram.Model.Definition.SystemActivityNode();
            systemActivityNode.set('systemActivity', sensorReading.get('forSystemActivity'));
            App.Diagram.Model.systemActivityNodes.add(systemActivityNode);
            
        }
        
        systemActivityNode.get('sensorReadings').add(sensorReading);
        
        if (predecessorSensorReading) {
            var systemActivityNodeOfPredecessor = App.Diagram.Model.findNodeForSystemActivity(predecessorSensorReading.get('forSystemActivity'));
            if (systemActivityNodeOfPredecessor
                    && systemActivityNode.get('predecessorNodes').contains(systemActivityNodeOfPredecessor) == false) {
                
                systemActivityNode.get('predecessorNodes').add(systemActivityNodeOfPredecessor);
                systemActivityNodeOfPredecessor.get('successorNodes').add(systemActivityNode);
                
                var connection = new App.Diagram.Model.Definition.Connection();
                connection.set('sourceNode', systemActivityNodeOfPredecessor);
                connection.set('targetNode', systemActivityNode);
                systemActivityNodeOfPredecessor.get('outgoingConnections').add(connection);
                systemActivityNode.get('incomingConnections').add(connection);
            }
        }
        
        return systemActivityNode;
        
    };
    
    Controller.focus = function (sensorReadingSequence) {
        // TODO: Allow focussing another sensorReadingSequence
    };
    
});
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
Testrails.start();