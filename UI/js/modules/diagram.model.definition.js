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