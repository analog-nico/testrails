package org.testrails.satellite.sensors.analyzer.regex;

import java.util.Iterator;
import java.util.Vector;
import java.util.regex.Pattern;

import org.testrails.satellite.sensors.analyzer.action.AnalyzerAction;

public class PatternRule {

	protected Pattern activationPattern;
	protected Vector<ExtractionChain> extractionChains = new Vector<ExtractionChain>();
	
	public PatternRule(Pattern activationPattern) {
		super();
		this.activationPattern = activationPattern;
	}
	
	public void addExtractionChain(ExtractionChain extractionChain) {
		extractionChains.add(extractionChain);
	}

	public Vector<AnalyzerAction> evaluate(String data) {
		
		if (activationPattern.matcher(data).find() == false) {
			return null;
		}
		
		Vector<AnalyzerAction> actions = new Vector<AnalyzerAction>();
		
		Iterator<ExtractionChain> iter = extractionChains.iterator();
		while (iter.hasNext()) {
			
			AnalyzerAction action = iter.next().run(data);
			if (action == null) {
				continue;
			}
			
			actions.add(action);
			
		}
		
		return actions;
		
	}
	
}
