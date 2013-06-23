package org.testrails.satellite.sensors.analyzer.action.common;

import org.testrails.satellite.sensors.analyzer.action.AbstractAnalyzerAction;
import org.testrails.satellite.sensors.eventset.EventSet;
import org.testrails.satellite.sensors.eventset.EventSetContext;
import org.testrails.satellite.sensors.eventset.EventSetVariableValue;

/**
 * Clears a variable in the given {@link EventSet}.
 * 
 * @author Nicolai Kamenzky
 * 
 */
public class ClearVariableAction extends AbstractAnalyzerAction {

	protected String variableName;

	public ClearVariableAction(String variableName) {
		super();
		this.variableName = variableName;
	}

	@Override
	public int getExecutionOrderRank() {
		return ExecutionOrderRank.CLEAR_VARIABLE_ACTION;
	}

	@Override
	public EventSet run(EventSetContext context, EventSet eventSetInUse, Object data) {

		if (eventSetInUse == null) {
			return eventSetInUse;
		}

		eventSetInUse.setVariableValue(variableName, new EventSetVariableValue());

		return eventSetInUse;

	}

	@Override
	public String toString() {
		return this.getClass().getSimpleName() + ": " + variableName;
	}

}
