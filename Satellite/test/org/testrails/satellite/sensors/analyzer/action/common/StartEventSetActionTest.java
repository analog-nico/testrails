package org.testrails.satellite.sensors.analyzer.action.common;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.testrails.satellite.sensors.FileSensor;
import org.testrails.satellite.sensors.MockedFileSensorModule;
import org.testrails.satellite.sensors.analyzer.action.common.CorrelateEventSetAction;
import org.testrails.satellite.sensors.analyzer.action.common.StartEventSetAction;

import com.google.inject.Guice;
import com.google.inject.Injector;

public class StartEventSetActionTest {

	@Before
	public void setUp() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testGetExecutionOrderRank() {
		assertTrue(
				"The StartEventSetAction must be executed before a CorrelateEventSetAction.",
				(new StartEventSetAction()).getExecutionOrderRank() < (new CorrelateEventSetAction(
						null).getExecutionOrderRank()));
	}

	@Test
	public void testCancelCorrelatedEventSet() {

		String fileContent
			= "test line 1\n"
			+ "test line 2";

		Injector injector = Guice.createInjector(new MockedFileSensorModule(fileContent));
		FileSensor sensor = injector.getInstance(FileSensor.class);

		sensor.start();

	}

	@Test
	public void testDontStartOnCorrelation() {

	}

	@Test
	public void testStartWithoutCorrelation() {

	}

}
