var diagramModel = Testrails.module('Diagram.Model', function (Model, App, Backbone, Marionette, $, _) {
    
    Model.findNodeForSystemActivity = function (systemActivity) {
        return Model.systemActivityNodes.find(function (systemActivityNode) {
                return systemActivityNode.get('systemActivity').cid == systemActivity.cid;
            });
    };
    
});

diagramModel.on("start", function () {
    diagramModel.systemActivityNodes = new Testrails.Diagram.Model.Definition.SystemActivityNodeList();
    diagramModel.nodeCellGrid = new Testrails.Diagram.Model.Definition.NodeCellGrid();
    diagramModel.emptyLane = new Testrails.Diagram.Model.Definition.Connection();
});