package org.testrails.satellite.sensors.analyzer;

import java.util.Collections;
import java.util.Iterator;
import java.util.Vector;

import org.testrails.satellite.sensors.analyzer.action.AnalyzerAction;
import org.testrails.satellite.sensors.eventset.EventSet;
import org.testrails.satellite.sensors.eventset.EventSetCache;
import org.testrails.satellite.sensors.eventset.EventSetContext;
import org.testrails.satellite.sensors.eventset.EventSetStatus;

public class ActionRunner {
	
	protected Vector<AnalyzerAction> actions;
	protected String analyzedSource;

	public ActionRunner(Vector<AnalyzerAction> actions, String analyzedSource) {
		super();
		this.actions = actions;
		this.analyzedSource = analyzedSource;
	}
	
	public void run() {
		
		Collections.sort(actions);
		
		EventSetContext context = EventSetCache.getInstance().getEventSetContext(analyzedSource);
		EventSet eventSetInUse = null;
		
		Iterator<AnalyzerAction> iter = actions.iterator();
		while (iter.hasNext()) {
			eventSetInUse = iter.next().run(context, eventSetInUse, null);
		}
		
		context.clearCorrelationTokens();
		
		if (eventSetInUse == null) {
			return;
		}
		
		if (eventSetInUse.getStatus() == EventSetStatus.NEW && eventSetInUse.containsVariables()) {
			
			eventSetInUse.setStatus(EventSetStatus.COLLECTION_IN_PROGRESS);
			context.addEventSet(eventSetInUse);
			
		} else if (eventSetInUse.getStatus() == EventSetStatus.COMPLETE) {
			
			context.publishAndRemoveEventSet(eventSetInUse);
			
		}
		
	}
	
}
