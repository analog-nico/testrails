package org.testrails.satellite.sensors.readers;

import org.testrails.satellite.sensors.buffer.Receiver;

public abstract class AbstractReader<T> implements Reader {

	protected Receiver<T> buffer;
	
	public AbstractReader(Receiver<T> buffer) {
		super();
		this.buffer = buffer;
	}
	
}
