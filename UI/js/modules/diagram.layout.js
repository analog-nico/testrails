Testrails.module('Diagram.Layout', function (Layout, App, Backbone, Marionette, $, _) {
    
    Layout.placeIntoGrid = function (systemActivityNode) {
        
        if (systemActivityNode.get('position').left == -1 && systemActivityNode.get('position').top == -1) {
            // SystemActivityNode was newly created and must be inserted into the grid
            
            if (systemActivityNode.get('incomingConnections').length == 0) {
                // This is the first node of a SensorReadingSequence
                
                App.Diagram.Model.nodeCellGrid.placeSystemActivityNode(systemActivityNode, 0, 0);
                
            } else {
                
                var columnOfLatestPredecessor = systemActivityNode.get('incomingConnections').last().get('sourceNode').get('gridPosition').column;
                var rowOfFreeCell = App.Diagram.Model.nodeCellGrid.at(columnOfLatestPredecessor).getLastOccupiedCell() + 1;
                
                App.Diagram.Model.nodeCellGrid.placeSystemActivityNode(systemActivityNode, columnOfLatestPredecessor, rowOfFreeCell);
                
                App.Diagram.Model.nodeCellGrid.placeConnection(systemActivityNode.get('incomingConnections').last());
                
            }
            
        } else {
            
            if (systemActivityNode.get('incomingConnections').length > 0
                    && systemActivityNode.get('incomingConnections').last().get('$el') == null) {
                App.Diagram.Model.nodeCellGrid.placeConnection(systemActivityNode.get('incomingConnections').last());
            }
            
        }
        
    };
    
});