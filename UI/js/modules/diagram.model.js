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