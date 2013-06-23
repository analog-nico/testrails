package org.testrails.satellite.sensors.analyzer.action.common;

import java.util.List;
import org.testrails.satellite.sensors.analyzer.action.AbstractAnalyzerAction;
import org.testrails.satellite.sensors.eventset.EventSet;
import org.testrails.satellite.sensors.eventset.EventSetContext;

public class LinkEventSetAction extends AbstractAnalyzerAction {

	protected String variableName;
	protected String inboundCorrelationToken;
	protected String outboundCorrelationToken;

	public LinkEventSetAction(String variableName) {
		super();
		this.variableName = variableName;
	}

	public LinkEventSetAction(String variableName,
			String inboundCorrelationToken, String outboundCorrelationToken) {
		super();
		this.variableName = variableName;
		this.inboundCorrelationToken = inboundCorrelationToken;
		this.outboundCorrelationToken = outboundCorrelationToken;
	}

	@Override
	public int getExecutionOrderRank() {
		return ExecutionOrderRank.LINK_EVENTSET_ACTION;
	}

	@Override
	public EventSet run(EventSetContext context, EventSet eventSetInUse,
			Object data) {

		if (eventSetInUse == null) {
			return eventSetInUse;
		}

		List<EventSet> correlatingEventSets = context.findCorrelatingEventSets(
				variableName, data, inboundCorrelationToken);
		
		correlatingEventSets.remove(eventSetInUse);
		
		if (outboundCorrelationToken != null && outboundCorrelationToken.length() > 0) {
			context.addCorrelationToken(outboundCorrelationToken, correlatingEventSets);
			return eventSetInUse;
		}
		
		if (correlatingEventSets.size() != 1) {
			return eventSetInUse;
		}

		EventSet correlatingEventSet = correlatingEventSets.get(0);
		
		context.linkEventSets(eventSetInUse, correlatingEventSet);
		
		return eventSetInUse;

	}
	
	@Override
	public String toString() {
		return this.getClass().getSimpleName() + ": " + variableName;
	}

}
