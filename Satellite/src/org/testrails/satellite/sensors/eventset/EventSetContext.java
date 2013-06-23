package org.testrails.satellite.sensors.eventset;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Vector;
import java.util.concurrent.ConcurrentHashMap;

import org.testrails.satellite.sensors.analyzer.action.common.PublishEventSetAction;

public class EventSetContext {

	protected String analyzedSource;
	protected List<EventSet> eventSets = new Vector<EventSet>();
	protected Map<String,List<EventSet>> correlationTokens = new ConcurrentHashMap<String,List<EventSet>>();
	protected Map<EventSet,List<EventSet>> eventSetLinks = new ConcurrentHashMap<EventSet,List<EventSet>>();

	public EventSetContext(String analyzedSource) {
		super();
		this.analyzedSource = analyzedSource;
	}

	public String getAnalyzedSource() {
		return analyzedSource;
	}

	public synchronized void addEventSet(EventSet eventSet) {
		eventSets.add(eventSet);
	}
	
	public void addCorrelationToken(String correlationTokenName, List<EventSet> eventSets) {
		correlationTokens.put(correlationTokenName, eventSets);
	}
	
	public Set<String> getCorrelationTokens() {
		return correlationTokens.keySet();
	}

	public synchronized List<EventSet> findCorrelatingEventSets(String variableName, Object data, String inboundCorrelationToken) {
		
		List<EventSet> eventSetSearchedIn = eventSets;
		
		if (inboundCorrelationToken != null && inboundCorrelationToken.length() > 0) {
			eventSetSearchedIn = correlationTokens.get(inboundCorrelationToken);
			if (eventSetSearchedIn == null) {
				return new Vector<EventSet>();
			}
		}
		
		List<EventSet> eventSetsFound = new Vector<EventSet>();
		
		for (EventSet eventSet : eventSetSearchedIn) {
			
			EventSetVariableValue value = eventSet.getVariableValue(variableName);
			if (value == null) {
				continue;
			}

			if (data.toString().equals(value.toString())) {
				eventSetsFound.add(eventSet);
			}

		}

		return eventSetsFound;

	}

	public void abortAndPublishEventSet(EventSet abortedEventSet) {
		abortedEventSet.setStatus(EventSetStatus.INCOMPLETE);
		publishAndRemoveEventSet(abortedEventSet);
	}

	public synchronized void publishAndRemoveEventSet(EventSet eventSet) {
		publishEventSet(eventSet);
		removeEventSet(eventSet);
	}
	
	public void removeEventSet(EventSet eventSet) {
		
		List<EventSet> linkedEventSets = getLinkedEventSets(eventSet);
		if (linkedEventSets != null) {
			
			removeEventSetLinks(eventSet);
			
			for (EventSet linkedEventSet : linkedEventSets) {
				removeEventSetLinks(linkedEventSet);
				eventSets.remove(linkedEventSet);
			}
			
		}
		
		eventSets.remove(eventSet);
		
	}

	protected void publishEventSet(EventSet eventSet) {

		if (eventSet.isPublished()) {
			return;
		}

		PublishEventSetAction publishAction = new PublishEventSetAction();
		publishAction.run(this, eventSet, null);

	}
	
	public void clearCorrelationTokens() {
		correlationTokens.clear();
	}
	
	public synchronized int getEventSetCount() {
		return eventSets.size();
	}

	public void linkEventSets(EventSet eventSetOne, EventSet eventSetTwo) {
		addEventSetLinks(eventSetOne, eventSetTwo);
		addEventSetLinks(eventSetTwo, eventSetOne);
	}
	
	protected void addEventSetLinks(EventSet forEventSet, EventSet toEventSet) {
		
		List<EventSet> linkedEventSets = eventSetLinks.get(forEventSet);
		if (linkedEventSets == null) {
			linkedEventSets = new Vector<EventSet>();
		}
		
		linkedEventSets.add(toEventSet);
		
		eventSetLinks.put(forEventSet, linkedEventSets);
		
	}

	public List<EventSet> getLinkedEventSets(EventSet eventSet) {
		return eventSetLinks.get(eventSet);
	}
	
	protected void removeEventSetLinks(EventSet forEventSet) {
		eventSetLinks.remove(forEventSet);
	}

}
