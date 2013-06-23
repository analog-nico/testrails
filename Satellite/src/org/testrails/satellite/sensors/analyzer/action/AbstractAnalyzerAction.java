package org.testrails.satellite.sensors.analyzer.action;

/**
 * Base class for all implementations of AnalyzerAction.
 * 
 * @author Nicolai Kamenzky
 *
 */
public abstract class AbstractAnalyzerAction implements AnalyzerAction {

	/**
	 * Used by the {@link ActionRunner} to get multiple {@link AnalyzerAction}s
	 * in order for execution.
	 */
	@Override
	public int compareTo(AnalyzerAction action) {
		return getExecutionOrderRank() - action.getExecutionOrderRank();
	}

	@Override
	public String toString() {
		return this.getClass().getSimpleName();
	}

}
