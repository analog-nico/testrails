package org.testrails.satellite.sensors.buffer;

public interface Receiver<T> {

	public void provide(T data);

}
