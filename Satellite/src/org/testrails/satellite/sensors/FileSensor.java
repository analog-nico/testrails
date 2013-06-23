package org.testrails.satellite.sensors;

import org.testrails.satellite.sensors.buffer.Buffer;
import org.testrails.satellite.sensors.readers.Reader;

import com.google.inject.Inject;

public class FileSensor extends AbstractSensor<String> {

	@Inject
	FileSensor(Reader reader, Buffer<String> buffer) {
		super(reader, buffer);
	}

}
