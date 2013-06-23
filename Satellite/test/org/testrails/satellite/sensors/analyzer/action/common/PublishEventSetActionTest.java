package org.testrails.satellite.sensors.analyzer.action.common;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.testrails.satellite.sensors.analyzer.action.common.CorrelateEventSetAction;
import org.testrails.satellite.sensors.analyzer.action.common.EndEventSetAction;
import org.testrails.satellite.sensors.analyzer.action.common.PublishEventSetAction;
import org.testrails.satellite.sensors.analyzer.action.common.SetVariableAction;

public class PublishEventSetActionTest {

	@Before
	public void setUp() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testGetExecutionOrderRank() {
		assertTrue(
				"The PublishEventSetAction must be executed after a CorrelateEventSetAction.",
				(new PublishEventSetAction()).getExecutionOrderRank()
					> (new CorrelateEventSetAction(null).getExecutionOrderRank()));
		assertTrue(
				"The PublishEventSetAction must be executed after a SetVariableAction.",
				(new PublishEventSetAction()).getExecutionOrderRank()
					> (new SetVariableAction(null).getExecutionOrderRank()));
		assertTrue(
				"The PublishEventSetAction must be executed after a EndEventSetAction.",
				(new PublishEventSetAction()).getExecutionOrderRank()
					> (new EndEventSetAction().getExecutionOrderRank()));
	}

}
