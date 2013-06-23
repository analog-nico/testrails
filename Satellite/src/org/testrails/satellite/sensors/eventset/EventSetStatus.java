package org.testrails.satellite.sensors.eventset;

public enum EventSetStatus {
	NEW("New"),
	COLLECTION_IN_PROGRESS("Collection in progress"),
	COLLECTION_IN_PROGRESS_FOR_LINKED_EVENTSETS("Collection in progress for linked EventSets"),
	INCOMPLETE("Incomplete"),
	COMPLETE("Complete");
	
	private String statusString;
	
	private EventSetStatus(String statusString) {
		this.statusString = statusString;
	}
	
	public String toString() {
		return statusString;
	}
	
}
