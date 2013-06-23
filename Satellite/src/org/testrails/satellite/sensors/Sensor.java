package org.testrails.satellite.sensors;

import org.testrails.satellite.sensors.analyzer.Analyzer;

public interface Sensor<T> {
	
	public void addAnalyzer(Analyzer<T> analyzer);

	public void start();
	
	public void stop();
	
}
