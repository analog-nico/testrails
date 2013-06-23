package org.testrails.satellite.sensors.eventset;

import java.util.HashMap;
import java.util.Map;

public class EventSetCache {
	
	protected Map<String,EventSetContext> contexts = new HashMap<String,EventSetContext>();

	private EventSetCache() {
	}

	private static class SingletonHolder {
		public static final EventSetCache INSTANCE = new EventSetCache();
	}

	public static EventSetCache getInstance() {
		return SingletonHolder.INSTANCE;
	}
	
	public synchronized EventSetContext getEventSetContext(String analyzedSource) {
		
		if (contexts.containsKey(analyzedSource)) {
			return contexts.get(analyzedSource);
		}
		
		EventSetContext context = new EventSetContext(analyzedSource);
		contexts.put(analyzedSource, context);
		return context;
		
	}

}
