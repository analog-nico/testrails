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