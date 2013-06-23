package org.testrails.satellite.sensors.analyzer.action.common;

import org.testrails.satellite.sensors.analyzer.action.AbstractAnalyzerAction;
import org.testrails.satellite.sensors.eventset.EventSet;
import org.testrails.satellite.sensors.eventset.EventSetContext;
import org.testrails.satellite.sensors.eventset.EventSetVariableValue;

/**
 * Sets or updates a variable in the given {@link EventSet}.
 * <p>
 * The variable with the name provided through the constructor is set or updated
 * with the data provided by the {@link Analyzer}.
 * 
 * @author Nicolai Kamenzky
 * 
 */
public class SetVariableAction extends AbstractAnalyzerAction {

	protected String variableName;
	protected boolean append;
	protected Object constantValue;

	public SetVariableAction(String variableName) {
		this(variableName, false, null);
	}

	public SetVariableAction(String variableName, Object constantValue) {
		this(variableName, false, constantValue);
	}

	public SetVariableAction(String variableName, boolean append) {
		this(variableName, append, null);
	}

	public SetVariableAction(String variableName, boolean append, Object constantValue) {
		super();
		this.variableName = variableName;
		this.append = append;
		this.constantValue = constantValue;
	}

	@Override
	public int getExecutionOrderRank() {
		return ExecutionOrderRank.SET_VARIABLE_ACTION;
	}

	@Override
	public EventSet run(EventSetContext context, EventSet eventSetInUse, Object data) {

		if (eventSetInUse == null) {
			return eventSetInUse;
		}
		
		Object dataToUse = data;
		if (constantValue != null) {
			dataToUse = constantValue;
		}

		if (append) {

			EventSetVariableValue value = eventSetInUse
					.getVariableValue(variableName);
			if (value == null) {
				eventSetInUse.setVariableValue(variableName,
						new EventSetVariableValue(dataToUse));
			} else {
				value.appendValue(dataToUse);
			}

		} else {

			eventSetInUse.setVariableValue(variableName,
					new EventSetVariableValue(dataToUse));

		}

		return eventSetInUse;

	}

	@Override
	public String toString() {
		return this.getClass().getSimpleName() + ": " + variableName + " = "
				+ (constantValue != null ? constantValue : "<data>");
	}

}
