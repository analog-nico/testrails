package org.testrails.satellite.sensors.analyzer.action.common;

import java.util.List;

import org.testrails.satellite.sensors.analyzer.action.AbstractAnalyzerAction;
import org.testrails.satellite.sensors.eventset.EventSet;
import org.testrails.satellite.sensors.eventset.EventSetContext;
import org.testrails.satellite.sensors.eventset.EventSetStatus;

/**
 * Set the {@link EventSet} currently in use to {@link EventSetStatus}
 * "Complete".
 * 
 * @author Nicolai Kamenzky
 * 
 */
public class EndEventSetAction extends AbstractAnalyzerAction {
	
	protected boolean retainForLinking;
	
	public EndEventSetAction() {
		this(false);
	}
	
	public EndEventSetAction(boolean retainForLinking) {
		super();
		this.retainForLinking = retainForLinking;
	}

	@Override
	public int getExecutionOrderRank() {
		return ExecutionOrderRank.END_EVENTSET_ACTION;
	}

	@Override
	public EventSet run(EventSetContext context, EventSet eventSetInUse, Object data) {

		if (eventSetInUse == null) {
			return eventSetInUse;
		}
		
		if (retainForLinking == true) {
			eventSetInUse.setStatus(EventSetStatus.COLLECTION_IN_PROGRESS_FOR_LINKED_EVENTSETS);
		} else {
			eventSetInUse.setStatus(EventSetStatus.COMPLETE);
		}

		List<EventSet> linkedEventSets = context.getLinkedEventSets(eventSetInUse);
		if (linkedEventSets == null) {
			return eventSetInUse;
		}
		
		for (EventSet eventSet : linkedEventSets) {
			if (eventSet.getStatus() != EventSetStatus.COMPLETE
					&& eventSet.getStatus() != EventSetStatus.COLLECTION_IN_PROGRESS_FOR_LINKED_EVENTSETS) {
				eventSetInUse.setStatus(EventSetStatus.COLLECTION_IN_PROGRESS_FOR_LINKED_EVENTSETS);
				break;
			}
		}
		
		boolean allEventSetsAreCompleteThemeselves = true;
		for (EventSet eventSet : linkedEventSets) {
			if (eventSet.getStatus() != EventSetStatus.COLLECTION_IN_PROGRESS_FOR_LINKED_EVENTSETS) {
				allEventSetsAreCompleteThemeselves = false;
				break;
			}
		}
		
		if (allEventSetsAreCompleteThemeselves == true) {
			for (EventSet eventSet : linkedEventSets) {
				eventSet.setStatus(EventSetStatus.COMPLETE);
			}
		}
		
		return eventSetInUse;

	}

}
