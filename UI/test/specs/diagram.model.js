var _grid, _emptyLane;

beforeEach(function () {
    Testrails.module("Diagram.Model").stop();
    Testrails.module("Diagram.Model").start();
    
    _grid = Testrails.Diagram.Model.nodeCellGrid;
    _emptyLane = Testrails.Diagram.Model.emptyLane;
});

describe("A connection", function () {
    
    it("can be initialized by passing the source and target node", function () {
        
        var sourceNode = new Testrails.Diagram.Model.Definition.SystemActivityNode();
        var targetNode = new Testrails.Diagram.Model.Definition.SystemActivityNode();
        
        var connection = new Testrails.Diagram.Model.Definition.Connection({ sourceNode: sourceNode, targetNode: targetNode });
        
        expect(connection.get('sourceNode')).toBe(sourceNode);
        expect(connection.get('targetNode')).toBe(targetNode);
        
        expect(sourceNode.hasOutgoingConnectionTo(targetNode)).toBe(true);
        expect(targetNode.hasIncomingConnectionFrom(sourceNode)).toBe(true);
        
    });
    
});

describe("A connection in the grid", function () {
    
    function placeTwoConnectingNodesIntoTheGrid(columnSourceNode, rowSourceNode, columnTargetNode, rowTargetRow) {
        
        var sourceNode = new Testrails.Diagram.Model.Definition.SystemActivityNode();
        sourceNode.set('systemActivity', new Testrails.Model.Definition.SystemActivity({ name: "source" }));
        
        _grid.placeSystemActivityNode(sourceNode, columnSourceNode, rowSourceNode);
        
        var targetNode = new Testrails.Diagram.Model.Definition.SystemActivityNode();
        targetNode.set('systemActivity', new Testrails.Model.Definition.SystemActivity({ name: "target" }));
        
        var connection = new Testrails.Diagram.Model.Definition.Connection({ sourceNode: sourceNode, targetNode: targetNode });
        
        _grid.placeSystemActivityNode(targetNode, columnTargetNode, rowTargetRow);
        _grid.placeConnection(connection);
        
        return connection;
        
    }
    
    it("can connect to the source node", function () {
        
        var node = new Testrails.Diagram.Model.Definition.SystemActivityNode();
        _grid.placeSystemActivityNode(node, 0, 0);
        
        var connection = new Testrails.Diagram.Model.Definition.Connection({ sourceNode: node, targetNode: node });
        _grid.placeConnection(connection);
        
        
        expect(_grid.getWidth()).toBe(1);
        expect(_grid.getHeight()).toBe(2);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        
        expect(_grid.at(0).at(0).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(0).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(1);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-1);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(-1);
        
    });
    
    it("can connect to a node to the south", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(0, 0, 0, 1);
        
        expect(_grid.getWidth()).toBe(1);
        expect(_grid.getHeight()).toBe(2);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(0);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(-1);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(-1);
        expect(connection.getFirstHorizontalLineLength()).toBe(0);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(-1);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(-1);
        expect(connection.getVerticalLineLength()).toBe(0);
        expect(connection.getSecondHorizontalLaneRow()).toBe(1);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(-1);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(-1);
        expect(connection.getSecondHorizontalLineLength()).toBe(0);
        
    });
    
    it("can connect to a node to the south (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(0, 0, 0, 2);
        
        expect(_grid.getWidth()).toBe(1);
        expect(_grid.getHeight()).toBe(3);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(1);
        
        expect(_grid.at(0).at(1).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(0).at(0).get('connectionsRightToBottom').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(1).get('connectionsRightToBottom').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsRightToBottom').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(1);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(1);
        expect(connection.getSecondHorizontalLaneRow()).toBe(2);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(-1);
        
    });
    
    it("can connect to a node to the south south west (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(1, 0, 0, 2);
        
        expect(_grid.getWidth()).toBe(2);
        expect(_grid.getHeight()).toBe(3);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(2).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(1).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(1).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(1).at(2).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(0).get('connectionsRightToBottom').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(1).get('connectionsRightToBottom').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsRightToBottom').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(-1);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(1);
        expect(connection.getSecondHorizontalLaneRow()).toBe(2);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(-1);
        
    });
    
    it("can connect to a node to the south west", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(1, 0, 0, 1);
        
        
        expect(_grid.getWidth()).toBe(2);
        expect(_grid.getHeight()).toBe(2);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(1).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(1).at(1).get('connectionsTopToLeft').at(0)).toBe(connection);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(-1);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(-1);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(-1);
        expect(connection.getVerticalLineLength()).toBe(0);
        expect(connection.getSecondHorizontalLaneRow()).toBe(1);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(-1);
        
    });
    
    it("can connect to a node to the south west (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(2, 0, 0, 2);
        
        
        expect(_grid.getWidth()).toBe(3);
        expect(_grid.getHeight()).toBe(3);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(2).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(2).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(2).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(1).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(1).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(2).at(1).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(1).at(2).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(2).at(2).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(0).get('connectionsRightToBottom').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(1).get('connectionsRightToBottom').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsRightToBottom').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(-2);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(1);
        expect(connection.getSecondHorizontalLaneRow()).toBe(2);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(-1);
        
    });
    
    it("can connect to a node to the west south west (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(2, 0, 0, 1);
        
        
        expect(_grid.getWidth()).toBe(3);
        expect(_grid.getHeight()).toBe(2);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(2).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(1).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(1).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(1).at(1).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(2).at(1).get('connectionsTopToLeft').at(0)).toBe(connection);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(-2);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(-1);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(-1);
        expect(connection.getVerticalLineLength()).toBe(0);
        expect(connection.getSecondHorizontalLaneRow()).toBe(1);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(-1);
        
    });
    
    it("can connect to a node to the west", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(1, 0, 0, 0);
        
        
        expect(_grid.getWidth()).toBe(2);
        expect(_grid.getHeight()).toBe(2);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(0).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(1).at(0).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(1).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(1).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(0).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(-1);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-1);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(-1);
        
    });
    
    it("can connect to a node to the west (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(2, 0, 0, 0);
        
        
        expect(_grid.getWidth()).toBe(3);
        expect(_grid.getHeight()).toBe(2);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(1).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(0).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(1).at(0).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(2).at(0).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(1).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(1).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(2).at(1).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(0).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(-2);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-1);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(-1);
        
    });
    
    it("can connect to a node to the west north west (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(2, 1, 0, 0);
        
        
        expect(_grid.getWidth()).toBe(3);
        expect(_grid.getHeight()).toBe(3);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(2).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(2).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(2).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(0).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(1).at(0).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(2).at(0).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(2).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(2).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(2).at(2).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(0).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(2);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(-2);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-2);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(-1);
        
    });
    
    it("can connect to a node to the north west", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(1, 1, 0, 0);
        
        
        expect(_grid.getWidth()).toBe(2);
        expect(_grid.getHeight()).toBe(3);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(2).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(0).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(1).at(0).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(2).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(2).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(0).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(2);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(-1);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-2);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(-1);
        
    });
    
    it("can connect to a node to the north west (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(2, 2, 0, 0);
        
        
        expect(_grid.getWidth()).toBe(3);
        expect(_grid.getHeight()).toBe(4);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(2).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(2).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(2).at(2).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(3).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(3).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(3).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(3).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(2).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(3).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(2).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(3).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(0).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(1).at(0).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(2).at(0).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(3).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(3).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(2).at(3).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(0).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(3).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(3);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(-2);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-3);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(-1);
        
    });
    
    it("can connect to a node to the north north west (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(1, 2, 0, 0);
        
        
        expect(_grid.getWidth()).toBe(2);
        expect(_grid.getHeight()).toBe(4);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(2).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(3).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(3).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(3).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(2).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(3).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(0).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(1).at(0).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(3).get('connectionsTopToLeft').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(3).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(0).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(3).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(3);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(-1);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-3);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(-1);
        
    });
    
    it("can connect to a node to the north", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(0, 1, 0, 0);
        
        
        expect(_grid.getWidth()).toBe(1);
        expect(_grid.getHeight()).toBe(3);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(1);
        
        expect(_grid.at(0).at(0).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(0).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(2);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(1);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-2);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(-1);
        
    });
    
    it("can connect to a node to the north (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(0, 2, 0, 0);
        
        
        expect(_grid.getWidth()).toBe(1);
        expect(_grid.getHeight()).toBe(4);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(3).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(3).getVerticalLaneCount()).toBe(1);
        
        expect(_grid.at(0).at(0).get('connectionsTopToLeft').at(0)).toBe(connection);
        expect(_grid.at(0).at(3).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(0).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(3).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(3);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(1);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-3);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(-1);
        
    });
    
    it("can connect to a node to the north north east (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(0, 2, 1, 0);
        
        
        expect(_grid.getWidth()).toBe(2);
        expect(_grid.getHeight()).toBe(4);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(2).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(3).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(3).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(3).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(2).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(3).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(0).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(0).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(0).at(3).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(1).at(3).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(3).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(3);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(1);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-3);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(1);
        
    });
    
    it("can connect to a node to the north east", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(0, 1, 1, 0);
        
        
        expect(_grid.getWidth()).toBe(2);
        expect(_grid.getHeight()).toBe(3);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(2).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(0).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(0).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(1).at(2).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(2);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(1);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-2);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(1);
        
    });
    
    it("can connect to a node to the north east (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(0, 2, 2, 0);
        
        
        expect(_grid.getWidth()).toBe(3);
        expect(_grid.getHeight()).toBe(4);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(2).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(2).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(2).at(2).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(3).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(3).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(3).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(0).at(3).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(2).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(3).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(2).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(2).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(3).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(0).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(0).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(2).at(0).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(0).at(3).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(1).at(3).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(2).at(3).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(1).at(1).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(1).at(2).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(1).at(3).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(3);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(2);
        expect(connection.getVerticalLaneColumn()).toBe(1);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-3);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(1);
        
    });
    
    it("can connect to a node to the east north east (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(0, 1, 2, 0);
        
        
        expect(_grid.getWidth()).toBe(3);
        expect(_grid.getHeight()).toBe(3);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(2).at(1).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(2).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(2).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(2).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(0).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(0).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(2).at(0).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(1).at(2).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(2).at(2).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(1).at(1).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(1).at(2).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(2);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(2);
        expect(connection.getVerticalLaneColumn()).toBe(1);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-2);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(1);
        
    });
    
    it("can connect to a node to the east", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(0, 0, 1, 0);
        
        
        expect(_grid.getWidth()).toBe(2);
        expect(_grid.getHeight()).toBe(2);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(0).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(0).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(1).at(1).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(1);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-1);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(1);
        
    });
    
    it("can connect to a node to the east (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(0, 0, 2, 0);
        
        
        expect(_grid.getWidth()).toBe(3);
        expect(_grid.getHeight()).toBe(2);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(0).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(2).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(1).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(0).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(0).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(2).at(0).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(0).at(1).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(1).at(1).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(2).at(1).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(0).get('connectionsRightToTop').at(0)).toBe(connection);
        expect(_grid.at(1).at(1).get('connectionsRightToTop').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(2);
        expect(connection.getVerticalLaneColumn()).toBe(1);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(-1);
        expect(connection.getSecondHorizontalLaneRow()).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(1);
        
    });
    
    it("can connect to a node to the east south east (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(0, 0, 2, 1);
        
        
        expect(_grid.getWidth()).toBe(3);
        expect(_grid.getHeight()).toBe(2);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(2).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(1).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(1).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(1).at(1).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(2).at(1).get('connectionsTopToRight').at(0)).toBe(connection);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(2);
        expect(connection.getVerticalLaneColumn()).toBe(1);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(-1);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(-1);
        expect(connection.getVerticalLineLength()).toBe(0);
        expect(connection.getSecondHorizontalLaneRow()).toBe(1);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(1);
        
    });
    
    it("can connect to a node to the south east", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(0, 0, 1, 1);
        
        
        expect(_grid.getWidth()).toBe(2);
        expect(_grid.getHeight()).toBe(2);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(1).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(1).at(1).get('connectionsTopToRight').at(0)).toBe(connection);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(1);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(-1);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(-1);
        expect(connection.getVerticalLineLength()).toBe(0);
        expect(connection.getSecondHorizontalLaneRow()).toBe(1);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(1);
        
    });
    
    it("can connect to a node to the south east (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(0, 0, 2, 2);
        
        
        expect(_grid.getWidth()).toBe(3);
        expect(_grid.getHeight()).toBe(3);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(2).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(2).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(2).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(2).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(2).at(2).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(1).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(1).at(1).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(2).at(1).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(2).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(2).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(2).at(2).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(1).at(0).get('connectionsRightToBottom').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(1).get('connectionsRightToBottom').at(0)).toBe(connection);
        expect(_grid.at(1).at(2).get('connectionsRightToBottom').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(2);
        expect(connection.getVerticalLaneColumn()).toBe(1);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(1);
        expect(connection.getSecondHorizontalLaneRow()).toBe(2);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(1);
        
    });
    
    it("can connect to a node to the south south east (far)", function () {
        
        var connection = placeTwoConnectingNodesIntoTheGrid(0, 0, 1, 2);
        
        
        expect(_grid.getWidth()).toBe(2);
        expect(_grid.getHeight()).toBe(3);
        
        expect(_grid.at(0).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(1).at(0).getHorizontalLaneCount()).toBe(0);
        expect(_grid.at(0).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(1).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(1).at(2).getHorizontalLaneCount()).toBe(1);
        expect(_grid.at(0).at(0).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(1).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(0).at(2).getVerticalLaneCount()).toBe(1);
        expect(_grid.at(1).at(0).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(1).getVerticalLaneCount()).toBe(0);
        expect(_grid.at(1).at(2).getVerticalLaneCount()).toBe(0);
        
        expect(_grid.at(0).at(1).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(1).at(1).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(2).get('connectionsTopToRight').at(0)).toBe(_emptyLane);
        expect(_grid.at(1).at(2).get('connectionsTopToRight').at(0)).toBe(connection);
        expect(_grid.at(0).at(0).get('connectionsRightToBottom').at(0)).toBe(_emptyLane);
        expect(_grid.at(0).at(1).get('connectionsRightToBottom').at(0)).toBe(connection);
        expect(_grid.at(0).at(2).get('connectionsRightToBottom').at(0)).toBe(_emptyLane);
        
        
        expect(connection.getFirstHorizonalLaneRow()).toBe(1);
        expect(connection.getFirstHorizonalLaneOffset().fromTop).toBe(0);
        expect(connection.getFirstHorizonalLaneOffset().fromBottom).toBe(0);
        expect(connection.getFirstHorizontalLineLength()).toBe(1);
        expect(connection.getVerticalLaneColumn()).toBe(0);
        expect(connection.getVerticalLaneOffset().fromLeft).toBe(0);
        expect(connection.getVerticalLaneOffset().fromRight).toBe(0);
        expect(connection.getVerticalLineLength()).toBe(1);
        expect(connection.getSecondHorizontalLaneRow()).toBe(2);
        expect(connection.getSecondHorizontalLaneOffset().fromTop).toBe(0);
        expect(connection.getSecondHorizontalLaneOffset().fromBottom).toBe(0);
        expect(connection.getSecondHorizontalLineLength()).toBe(1);
        
    });
    
});