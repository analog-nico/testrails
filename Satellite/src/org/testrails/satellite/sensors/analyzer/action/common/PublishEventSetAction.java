package org.testrails.satellite.sensors.analyzer.action.common;

import java.util.List;
import java.util.Set;

import org.testrails.satellite.sensors.analyzer.action.AbstractAnalyzerAction;
import org.testrails.satellite.sensors.eventset.EventSet;
import org.testrails.satellite.sensors.eventset.EventSetContext;

/**
 * Publishes the {@link EventSet} currently in use to anyone who observes the
 * output of the {@link Analyzer}.
 * 
 * @author Nicolai Kamenzky
 * 
 */
public class PublishEventSetAction extends AbstractAnalyzerAction {
	
	protected boolean includeLinkedEventSets;
	
	public PublishEventSetAction() {
		this(true);
	}
	
	public PublishEventSetAction(boolean includeLinkedEventSets) {
		super();
		this.includeLinkedEventSets = includeLinkedEventSets;
	}

	@Override
	public int getExecutionOrderRank() {
		return ExecutionOrderRank.PUBLISH_EVENTSET_ACTION;
	}

	@Override
	public EventSet run(EventSetContext context, EventSet eventSetInUse, Object data) {

		if (eventSetInUse == null) {
			return eventSetInUse;
		}

		System.out.println("PUBLISHING EventSet " + eventSetInUse.hashCode());
		publishEventSetContent(eventSetInUse);
		
		if (includeLinkedEventSets == true) {
			
			List<EventSet> linkedEventSets = context.getLinkedEventSets(eventSetInUse);
			if (linkedEventSets != null) {
				for (EventSet eventSet : linkedEventSets) {
					
					System.out.println();
					System.out.println("Linked EventSet " + eventSetInUse.hashCode());
					publishEventSetContent(eventSet);
					
					eventSet.setPublished();
					
				}
			}
			
		}

		System.out.println();
		System.out.println();

		eventSetInUse.setPublished();

		return eventSetInUse;

	}

	private void publishEventSetContent(EventSet eventSet) {
		System.out.println("Source:    " + eventSet.getSource());

		Set<String> variableNames = eventSet.getVariableNames();
		if (variableNames.size() == 0) {

			System.out.println("Variables: NONE");

		} else {

			String[] variablesNamesArray = new String[variableNames.size()];
			variablesNamesArray = variableNames.toArray(variablesNamesArray);

			for (int i = 0; i < variablesNamesArray.length; i++) {

				if (i == 0) {
					System.out.print("Variables: ");
				} else {
					System.out.print("           ");
				}

				System.out.println(variablesNamesArray[i]
						+ " - "
						+ eventSet
								.getVariableValue(variablesNamesArray[i])
								.toString());

			}

		}

		System.out.println("Status:    " + eventSet.getStatus());
	}

}
