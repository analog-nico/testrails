package org.testrails.satellite.sensors.analyzer.action.common;

import org.testrails.satellite.sensors.analyzer.action.AbstractAnalyzerAction;
import org.testrails.satellite.sensors.eventset.EventSet;
import org.testrails.satellite.sensors.eventset.EventSetContext;

public class InternalStatisticsAction extends AbstractAnalyzerAction {

	@Override
	public int getExecutionOrderRank() {
		return ExecutionOrderRank.INTERNAL_STATISTICS_ACTION;
	}

	@Override
	public EventSet run(EventSetContext context, EventSet eventSetInUse, Object data) {
		
		System.out.println(context.getAnalyzedSource() + ": " + context.getEventSetCount() + " EventSets in progress");
		
		return eventSetInUse;
		
	}

}
