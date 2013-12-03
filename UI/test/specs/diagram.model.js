beforeEach(function () {
    Testrails.module("Diagram.Model").stop();
    Testrails.module("Diagram.Model").start();
});

describe("A Connection", function () {
    
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
    
    it("can connect two nodes via a straight vertical line", function () {
        
        var sourceNode = new Testrails.Diagram.Model.Definition.SystemActivityNode();
        
        Testrails.Diagram.Model.nodeCellGrid.placeSystemActivityNode(sourceNode, 0, 0);
        
        var targetNode = new Testrails.Diagram.Model.Definition.SystemActivityNode();
        var connection = new Testrails.Diagram.Model.Definition.Connection({ sourceNode: sourceNode, targetNode: targetNode });
        
        Testrails.Diagram.Model.nodeCellGrid.placeSystemActivityNode(targetNode, 0, 1);
        Testrails.Diagram.Model.nodeCellGrid.placeConnection(connection);
        
        expect(Testrails.Diagram.Model.nodeCellGrid.getWidth()).toBe(1);
        expect(Testrails.Diagram.Model.nodeCellGrid.getHeight()).toBe(2);
        
        expect(Testrails.Diagram.Model.nodeCellGrid.at(0).at(0).getHorizontalLaneCount()).toBe(0);
        expect(Testrails.Diagram.Model.nodeCellGrid.at(0).at(0).getVerticalLaneCount()).toBe(0);
        expect(Testrails.Diagram.Model.nodeCellGrid.at(0).at(1).getHorizontalLaneCount()).toBe(0);
        expect(Testrails.Diagram.Model.nodeCellGrid.at(0).at(1).getVerticalLaneCount()).toBe(0);
        
    });
    
});