package org.testrails.satellite.sensors.analyzer.action.common;

import java.util.Set;

import org.testrails.satellite.sensors.analyzer.action.AbstractAnalyzerAction;
import org.testrails.satellite.sensors.eventset.EventSet;
import org.testrails.satellite.sensors.eventset.EventSetContext;

public class UncorrelatedDataStatisticsAction extends AbstractAnalyzerAction {

	@Override
	public int getExecutionOrderRank() {
		return ExecutionOrderRank.UNCORRELATED_DATA_STATISTICS_ACTION;
	}

	@Override
	public EventSet run(EventSetContext context, EventSet eventSetInUse,
			Object data) {
		
		if (eventSetInUse != null) {
			
			System.out.println("v/                              " + data.toString());
			
		} else {
			
			Set<String> tokens = context.getCorrelationTokens();
			String listedTokens = "";
			
			for (String token : tokens) {
				if (listedTokens.length() > 0) {
					listedTokens += ", ";
				}
				listedTokens += token;
			}
			
			if (listedTokens.length() == 0) {
				listedTokens += "Tokens: None";
			} else {
				listedTokens = "Tokens: " + listedTokens;
			}
			
			for ( int i = listedTokens.length() ; i < 31 ; i++ ) {
				listedTokens += " ";
			}
			
			System.out.println(listedTokens + " " + data.toString());
			
		}
		
		return eventSetInUse;
	}

}
