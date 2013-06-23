package org.testrails.satellite.sensors.analyzer;

public abstract class AbstractAnalyzer<T> implements Analyzer<T> {
	
	protected String analyzedSource;
	
	public AbstractAnalyzer(String analyzerName, String analyzedSource) {
		super();
		this.analyzedSource = analyzedSource;
	}

}
