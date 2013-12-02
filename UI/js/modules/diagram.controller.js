Testrails.module('Diagram.Controller', function (Controller, App, Backbone, Marionette, $, _) {
    
    Controller.watch = function (sensorReadingSequence, focus) {
        
        this.listenTo(sensorReadingSequence.get('sensorReadings'), 'add', function (sensorReading, sensorReadingList, options) {
            
            var systemActivityNode = getSystemActivityNodeForSensorReading(sensorReading, sensorReadingList);
            App.Diagram.Layout.placeIntoGrid(systemActivityNode);
            App.Diagram.View.refresh();
            
        });
        
    };
    
    function getSystemActivityNodeForSensorReading(sensorReading, sensorReadingList) {
        
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
