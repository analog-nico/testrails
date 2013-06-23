package org.testrails.satellite.sensors.analyzer.action.common;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.testrails.satellite.sensors.analyzer.action.common.CorrelateEventSetAction;
import org.testrails.satellite.sensors.analyzer.action.common.EndEventSetAction;
import org.testrails.satellite.sensors.analyzer.action.common.PublishEventSetAction;

public class EndEventSetActionTest {

	@Before
	public void setUp() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testGetExecutionOrderRank() {
		assertTrue(
				"The EndEventSetAction must be executed after a CorrelateEventSetAction.",
				(new EndEventSetAction()).getExecutionOrderRank()
					> (new CorrelateEventSetAction(null).getExecutionOrderRank()));
		assertTrue(
				"The EndEventSetAction must be executed before a PublishEventSetAction.",
				(new EndEventSetAction()).getExecutionOrderRank()
					< (new PublishEventSetAction().getExecutionOrderRank()));
	}

}
