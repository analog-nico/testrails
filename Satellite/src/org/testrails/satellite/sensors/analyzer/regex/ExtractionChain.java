package org.testrails.satellite.sensors.analyzer.regex;

import java.util.Iterator;
import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.testrails.satellite.sensors.analyzer.action.AnalyzerAction;
import org.testrails.satellite.sensors.analyzer.action.AnalyzerActionDataDecorator;

public class ExtractionChain {
	
	protected Vector<Pattern> extractionPatterns = new Vector<Pattern>();
	protected AnalyzerAction action;
	
	public ExtractionChain(AnalyzerAction action) {
		super();
		this.action = action;
	}
	
	public void addExtractionPattern(Pattern extractionPattern) {
		extractionPatterns.add(extractionPattern);
	}

	public AnalyzerAction run(String data) {
		
		String extractedData = data;
		
		Iterator<Pattern> iter = extractionPatterns.iterator();
		while (iter.hasNext()) {
			
			Matcher matcher = iter.next().matcher(extractedData);
			if (matcher.find() == false) {
				return null;
			}
			
			extractedData = extractedData.substring(matcher.start(), matcher.end());
			
		}
		
		return new AnalyzerActionDataDecorator(action, extractedData);
		
	}

}
