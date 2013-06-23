package org.testrails.satellite.sensors.analyzer.action.common;

import java.util.Vector;

import org.testrails.satellite.sensors.analyzer.action.AbstractAnalyzerAction;
import org.testrails.satellite.sensors.eventset.EventSet;
import org.testrails.satellite.sensors.eventset.EventSetContext;
import org.testrails.satellite.sensors.eventset.EventSetVariableValue;

/**
 * Copies the value of a variable to another one in the given {@link EventSet}.
 * 
 * @author Nicolai Kamenzky
 * 
 */
public class CopyVariableAction extends AbstractAnalyzerAction {

	protected String fromVariableName;
	protected String toVariableName;
	protected boolean append;

	public CopyVariableAction(String fromVariableName, String toVariableName) {
		this(fromVariableName, toVariableName, false);
	}

	public CopyVariableAction(String fromVariableName, String toVariableName, boolean append) {
		super();
		this.fromVariableName = fromVariableName;
		this.toVariableName = toVariableName;
		this.append = append;
	}

	@Override
	public int getExecutionOrderRank() {
		return ExecutionOrderRank.COPY_VARIABLE_ACTION;
	}

	@Override
	public EventSet run(EventSetContext context, EventSet eventSetInUse, Object data) {
		
		if (eventSetInUse == null) {
			return eventSetInUse;
		}
		
		EventSetVariableValue fromVariableValue = eventSetInUse.getVariableValue(fromVariableName);
		EventSetVariableValue toVariableValue = eventSetInUse.getVariableValue(toVariableName);
		
		if (toVariableValue == null) {
			toVariableValue = new EventSetVariableValue();
			eventSetInUse.setVariableValue(toVariableName, toVariableValue);
		}
		
		if (append) {
			if (fromVariableValue != null) {
				toVariableValue.appendValues(fromVariableValue.getValues());
			}
		} else {
			if (fromVariableValue != null) {
				toVariableValue.setValues(fromVariableValue.getValues());
			} else {
				toVariableValue.setValues(new Vector<Object>());
			}
		}
		
		return eventSetInUse;

	}

	@Override
	public String toString() {
		return this.getClass().getSimpleName() + ": " + toVariableName + " = "
				+ fromVariableName;
	}

}
