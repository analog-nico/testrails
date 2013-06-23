package org.testrails.satellite.sensors.readers;

import org.testrails.satellite.sensors.buffer.Receiver;
import org.testrails.satellite.sensors.readers.AbstractReader;


import com.google.inject.Inject;

public class StringParameterReader extends AbstractReader<String> {
	
	final protected String fileContent;

	@Inject
	public StringParameterReader(@FileContent String fileContent, Receiver<String> buffer) {
		super(buffer);
		this.fileContent = fileContent;
	}

	@Override
	public void start() {
		
		String[] lines = fileContent.split("\n");
		for (String line : lines) {
			this.buffer.provide(line);
		}

	}

	@Override
	public void stop() {
	}

}
