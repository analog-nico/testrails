package org.testrails.satellite.sensors.buffer;

public interface Consumer<T> {
	
	public void consume(T data);

}
