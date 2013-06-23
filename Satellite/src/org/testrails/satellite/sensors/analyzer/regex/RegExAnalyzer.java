package org.testrails.satellite.sensors.analyzer.regex;

import java.util.Iterator;
import java.util.Vector;

import org.testrails.satellite.sensors.analyzer.AbstractAnalyzer;
import org.testrails.satellite.sensors.analyzer.ActionRunner;
import org.testrails.satellite.sensors.analyzer.action.AnalyzerAction;

public class RegExAnalyzer extends AbstractAnalyzer<String> {

	protected Vector<PatternRule> patternRules = new Vector<PatternRule>();

	public RegExAnalyzer(String analyzerName, String analyzedSource) {
		super(analyzerName, analyzedSource);
	}

	public void addPatternRule(PatternRule patternRule) {
		patternRules.add(patternRule);
	}

	@Override
	public void consume(String data) {
		
		try {
			
			Vector<AnalyzerAction> actions = new Vector<AnalyzerAction>();
			
			Iterator<PatternRule> iter = patternRules.iterator();
			while (iter.hasNext()) {
				
				Vector<AnalyzerAction> newActions = iter.next().evaluate(data);
				if (newActions == null) {
					continue;
				}
				
				actions.addAll(newActions);
				
			}
			
			// TODO: Inject dependency to ActionRunner
			ActionRunner runner = new ActionRunner(actions, analyzedSource);
			runner.run();
			
		} catch (Exception e) {
			System.err.println("An error occurred while analyzing the following line: " + data);
			e.printStackTrace();
		}
		
	}

}
