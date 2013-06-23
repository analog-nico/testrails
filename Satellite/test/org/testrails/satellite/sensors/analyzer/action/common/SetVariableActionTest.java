package org.testrails.satellite.sensors.analyzer.action.common;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.testrails.satellite.sensors.analyzer.action.common.CorrelateEventSetAction;
import org.testrails.satellite.sensors.analyzer.action.common.PublishEventSetAction;
import org.testrails.satellite.sensors.analyzer.action.common.SetVariableAction;

public class SetVariableActionTest {

	@Before
	public void setUp() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testGetExecutionOrderRank() {
		assertTrue(
				"The SetVariableAction must be executed after a CorrelateEventSetAction.",
				(new SetVariableAction(null)).getExecutionOrderRank() > (new CorrelateEventSetAction(
						null).getExecutionOrderRank()));
		assertTrue(
				"The SetVariableAction must be executed before a PublishEventSetAction.",
				(new SetVariableAction(null)).getExecutionOrderRank() < (new PublishEventSetAction()
						.getExecutionOrderRank()));
	}

}
