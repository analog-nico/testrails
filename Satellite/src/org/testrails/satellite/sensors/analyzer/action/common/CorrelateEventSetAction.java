package org.testrails.satellite.sensors.analyzer.action.common;

import java.util.Iterator;
import java.util.List;

import org.testrails.satellite.sensors.analyzer.action.AbstractAnalyzerAction;
import org.testrails.satellite.sensors.eventset.EventSet;
import org.testrails.satellite.sensors.eventset.EventSetContext;
import org.testrails.satellite.sensors.eventset.EventSetStatus;

/**
 * Retrieves the matching {@link EventSet} from the given
 * {@link EventSetContext}.
 * <p>
 * If a matching {@link EventSet} was retrieved from the given
 * {@link EventSetContext} but a preceding {@link StartEventSetAction} already
 * created a new {@link EventSet} then the retrieved {@link EventSet} is
 * published with {@link  } "Incomplete".
 * 
 * @author Nicolai Kamenzky
 * 
 */
public class CorrelateEventSetAction extends AbstractAnalyzerAction {

	protected String variableName;
	protected String inboundCorrelationToken;
	protected String outboundCorrelationToken;

	public CorrelateEventSetAction(String variableName) {
		super();
		this.variableName = variableName;
	}

	public CorrelateEventSetAction(String variableName,
			String inboundCorrelationToken, String outboundCorrelationToken) {
		super();
		this.variableName = variableName;
		this.inboundCorrelationToken = inboundCorrelationToken;
		this.outboundCorrelationToken = outboundCorrelationToken;
	}

	@Override
	public int getExecutionOrderRank() {
		return ExecutionOrderRank.CORRELATE_EVENTSET_ACTION;
	}

	@Override
	public EventSet run(EventSetContext context, EventSet eventSetInUse, Object data) {

		if (eventSetInUse != null
				&& eventSetInUse.getStatus() == EventSetStatus.COLLECTION_IN_PROGRESS) {
			return eventSetInUse;
		}

		List<EventSet> correlatingEventSets = context.findCorrelatingEventSets(
				variableName, data, inboundCorrelationToken);
		
		Iterator<EventSet> iter = correlatingEventSets.iterator();
		while (iter.hasNext()) {
			EventSet eventSet = iter.next();
			if (eventSet.getStatus() != EventSetStatus.COLLECTION_IN_PROGRESS) {
				iter.remove();
			}
		}
		
		if (outboundCorrelationToken != null && outboundCorrelationToken.length() > 0) {
			context.addCorrelationToken(outboundCorrelationToken, correlatingEventSets);
			return eventSetInUse;
		}
		
		if (correlatingEventSets.size() != 1) {
			return eventSetInUse;
		}

		EventSet correlatingEventSet = correlatingEventSets.get(0);
		
		if (eventSetInUse != null
				&& eventSetInUse.getStatus() == EventSetStatus.NEW) {
			context.abortAndPublishEventSet(correlatingEventSet);
			return eventSetInUse;
		}

		return correlatingEventSet;

	}

	@Override
	public String toString() {
		return this.getClass().getSimpleName() + ": " + variableName;
	}

}
