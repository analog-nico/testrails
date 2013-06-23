package org.testrails.satellite.sensors.analyzer.action.common;

public class ExecutionOrderRank {
	
	public static final int START_EVENTSET_ACTION = 1;
	public static final int CORRELATE_EVENTSET_ACTION = 64;
	public static final int START_EVENTSET_ACTION_WITH_CORRELATING_FIRST = 96;
	public static final int UNCORRELATED_DATA_STATISTICS_ACTION = 112;
	
	public static final int COPY_VARIABLE_ACTION = 128;
	public static final int SET_VARIABLE_ACTION = 160;
	public static final int LINK_EVENTSET_ACTION = 176;
	
	public static final int CLEAR_VARIABLE_ACTION = 192;
	public static final int END_EVENTSET_ACTION = 192;
	
	public static final int PUBLISH_EVENTSET_ACTION = 256;
	public static final int WRITE_VARIABLE_TO_FILE_ACTION = 256;
	
	public static final int INTERNAL_STATISTICS_ACTION = 512;
	
}
