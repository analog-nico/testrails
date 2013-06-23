package org.testrails.satellite.sensors.eventset;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class EventSet {

	protected String source;
	protected Map<String,EventSetVariableValue> variables = new ConcurrentHashMap<String,EventSetVariableValue>();
	protected EventSetStatus status = EventSetStatus.NEW;
	protected boolean published = false;
	
	public EventSet(String source) {
		super();
		this.source = source;
	}
	
	public EventSetVariableValue getVariableValue(String variableName) {
		return variables.get(variableName);
	}
	
	public void setVariableValue(String variableName, EventSetVariableValue value) {
		variables.put(variableName, value);
		published = false;
	}
	
	public EventSetStatus getStatus() {
		return status;
	}
	
	public void setStatus(EventSetStatus newStatus) {
		status = newStatus;
		published = false;
	}
	
	public boolean isPublished() {
		return published;
	}
	
	public void setPublished() {
		published = true;
	}

	public String getSource() {
		return source;
	}

	public Set<String> getVariableNames() {
		return variables.keySet();
	}
	
	public boolean containsVariables() {
		return variables.isEmpty() ? false : true;
	}

}
