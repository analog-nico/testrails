package org.testrails.satellite.sensors.analyzer.action;

import org.testrails.satellite.sensors.eventset.EventSet;
import org.testrails.satellite.sensors.eventset.EventSetContext;

public class AnalyzerActionDataDecorator extends AbstractAnalyzerAction {

	protected final AnalyzerAction action;
	protected final Object data;
	
	public AnalyzerActionDataDecorator(AnalyzerAction action, Object data) {
		super();
		this.action = action;
		this.data = data;
	}
	
	@Override
	public int getExecutionOrderRank() {
		return action.getExecutionOrderRank();
	}

	@Override
	public EventSet run(EventSetContext context, EventSet eventSetInUse,
			Object data) {
		return action.run(context, eventSetInUse, this.data);
	}
	
	public String toString() {
		return action.toString();
	}
	
}
