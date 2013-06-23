package org.testrails.satellite.sensors.analyzer.action.common;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.testrails.satellite.sensors.analyzer.action.common.CorrelateEventSetAction;
import org.testrails.satellite.sensors.analyzer.action.common.EndEventSetAction;
import org.testrails.satellite.sensors.analyzer.action.common.PublishEventSetAction;
import org.testrails.satellite.sensors.analyzer.action.common.SetVariableAction;
import org.testrails.satellite.sensors.analyzer.action.common.StartEventSetAction;

public class CorrelateEventSetActionTest {

	@Before
	public void setUp() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testGetExecutionOrderRank() {
		assertTrue(
				"The CorrelateEventSetAction must be executed after a StartEventSetAction.",
				(new CorrelateEventSetAction(null)).getExecutionOrderRank() > (new StartEventSetAction()
						.getExecutionOrderRank()));
		assertTrue(
				"The CorrelateEventSetAction must be executed before a SetVariableAction.",
				(new CorrelateEventSetAction(null)).getExecutionOrderRank() < (new SetVariableAction(
						null).getExecutionOrderRank()));
		assertTrue(
				"The CorrelateEventSetAction must be executed before all a EndEventSetAction.",
				(new CorrelateEventSetAction(null)).getExecutionOrderRank() < (new EndEventSetAction()
						.getExecutionOrderRank()));
		assertTrue(
				"The CorrelateEventSetAction must be executed before a PublishEventSetAction.",
				(new CorrelateEventSetAction(null)).getExecutionOrderRank() < (new PublishEventSetAction()
						.getExecutionOrderRank()));
	}

}
