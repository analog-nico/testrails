package org.testrails.satellite.sensors.analyzer.action.common;

import org.testrails.satellite.sensors.analyzer.action.AbstractAnalyzerAction;
import org.testrails.satellite.sensors.eventset.EventSet;
import org.testrails.satellite.sensors.eventset.EventSetContext;
import org.testrails.satellite.sensors.eventset.EventSetStatus;

/**
 * Creates a new {@link EventSet}.
 * 
 * @author Nicolai Kamenzky
 *
 */
public class StartEventSetAction extends AbstractAnalyzerAction {
	
	protected final boolean tryToCorrelateFirst;
	
	public StartEventSetAction() {
		this(false);
	}
	
	public StartEventSetAction(boolean tryToCorrelateFirst) {
		super();
		this.tryToCorrelateFirst = tryToCorrelateFirst;
	}

	@Override
	public int getExecutionOrderRank() {
		return (tryToCorrelateFirst
				? ExecutionOrderRank.START_EVENTSET_ACTION_WITH_CORRELATING_FIRST
				: ExecutionOrderRank.START_EVENTSET_ACTION);
	}
	
	@Override
	public EventSet run(EventSetContext context, EventSet eventSetInUse, Object data) {
		
		// Do we still need to create a new EventSet? (Usually applies when tryToCorrelateFirst == true.)
		if (eventSetInUse != null && eventSetInUse.getStatus() == EventSetStatus.COLLECTION_IN_PROGRESS) {
			return eventSetInUse;
		}
		
		// Another StartEventSetAction already created a new EventSet. Thus conflicting with this one.
		if (eventSetInUse != null && eventSetInUse.getStatus() == EventSetStatus.NEW) {
			context.abortAndPublishEventSet(eventSetInUse);
		}
		
		EventSet eventSet = new EventSet(context.getAnalyzedSource());
		return eventSet;
		
	}
	
}
