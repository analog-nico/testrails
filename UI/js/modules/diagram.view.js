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