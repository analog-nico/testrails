package org.testrails.satellite.sensors.buffer;

import java.util.Vector;

public class Buffer<T> implements Receiver<T> {
	
	protected Vector<T> buffer = new Vector<T>();
	protected Vector<Consumer<T>> consumers = new Vector<Consumer<T>>();
	
	public void addConsumer(Consumer<T> consumer) {
		consumers.add(consumer);
	}

	public void provide(T data) {
		buffer.add(data);
		// TODO: Call in a separate thread.
		notifyConsumers();
	}
	
	public void notifyConsumers() {
		
		T data = buffer.get(0);
		buffer.remove(0);
		
		for (Consumer<T> consumer : consumers) {
			consumer.consume(data);
		}
		
	}
	
}
