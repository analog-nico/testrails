package org.testrails.satellite.sensors.analyzer.action;

import org.testrails.satellite.sensors.analyzer.action.common.CorrelateEventSetAction;
import org.testrails.satellite.sensors.analyzer.action.common.PublishEventSetAction;
import org.testrails.satellite.sensors.analyzer.action.common.StartEventSetAction;
import org.testrails.satellite.sensors.eventset.EventSet;
import org.testrails.satellite.sensors.eventset.EventSetContext;

/**
 * An AnalyzerAction contributes to creating, updating, and publishing
 * {@link EventSet}s.
 * <p>
 * AnalyzerActions are independent of the kind of source being analyzed (like a
 * log file, a database, et cetera) and complete the work of the
 * {@link Analyzer} by publishing the output of type {@link EventSet} through
 * the {@link PublishEventSetAction}.
 * <p>
 * AnalyzerActions are implemented by deriving {@link AbstractAnalyzerAction}.
 * 
 * @author Nicolai Kamenzky
 * 
 */
public interface AnalyzerAction extends Comparable<AnalyzerAction> {

	/**
	 * Defines the rank of this object in the execution order of multiple action
	 * executed in the same batch by the {@link ActionRunner}.
	 * <p>
	 * The rank 1 is reserved for the {@link StartEventSetAction}. This action
	 * is executed first. The rank 256 is reserved for the
	 * {@link PublishEventSetAction}. This action is executed last.
	 * <p>
	 * The rank 64 is reserved for the {@link CorrelateEventSetAction}. For your
	 * own AnalyzerAction implementation use a rank higher than 64 to ensure
	 * that a {@link EventSet} is available during execution of your action.
	 * 
	 * @return The execution order rank of this object.
	 */
	public int getExecutionOrderRank();

	/**
	 * Executes the AnalyzerAction.
	 * 
	 * @param context
	 *            Contains all available {@link EventSet}s for the same source
	 *            which is currently analyzed.
	 * @param eventSetInUse
	 *            The {@link EventSet} which is provided by the
	 *            {@link AnalyzerAction} which was executed before this one.
	 * @param data
	 *            The data provided for the action to execute on. For example if
	 *            you use a {@link RegExAnalyzer} this would be the text line
	 *            filtered through some regular expressions.
	 * @return The {@link EventSet} to be used for succeeding actions. Usually
	 *         eventSetInUse is returned.
	 */
	public EventSet run(EventSetContext context, EventSet eventSetInUse,
			Object data);

}
