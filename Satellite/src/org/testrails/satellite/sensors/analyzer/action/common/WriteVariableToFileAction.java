package org.testrails.satellite.sensors.analyzer.action.common;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.testrails.satellite.sensors.analyzer.action.AbstractAnalyzerAction;
import org.testrails.satellite.sensors.eventset.EventSet;
import org.testrails.satellite.sensors.eventset.EventSetContext;
import org.testrails.satellite.sensors.eventset.EventSetVariableValue;

public class WriteVariableToFileAction extends AbstractAnalyzerAction {
	
	protected String variableName;
	protected String fileLocation;
	
	public WriteVariableToFileAction(String variableName, String fileLocation) {
		super();
		this.variableName = variableName;
		this.fileLocation = fileLocation;
	}

	@Override
	public int getExecutionOrderRank() {
		return ExecutionOrderRank.WRITE_VARIABLE_TO_FILE_ACTION;
	}

	@Override
	public EventSet run(EventSetContext context, EventSet eventSetInUse,
			Object data) {
		
		if (eventSetInUse == null) {
			return eventSetInUse;
		}
		
		EventSetVariableValue variableValue = eventSetInUse.getVariableValue(variableName);
		
		if (variableValue == null || variableValue.getValues().size() == 0) {
			return eventSetInUse;
		}
		
		try {
			FileUtils.writeStringToFile(new File(fileLocation), variableValue.toString() + "\n", true);
		} catch (IOException e) {
			System.err.println("Unable to write to file: " + fileLocation);
		}
		
		return eventSetInUse;
	}

}
