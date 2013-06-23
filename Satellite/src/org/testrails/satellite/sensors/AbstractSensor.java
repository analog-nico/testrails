package org.testrails.satellite.sensors;

import java.util.Vector;

import org.testrails.satellite.sensors.analyzer.Analyzer;
import org.testrails.satellite.sensors.buffer.Buffer;
import org.testrails.satellite.sensors.buffer.Consumer;
import org.testrails.satellite.sensors.readers.Reader;

public abstract class AbstractSensor<T> implements Sensor<T> {

	protected Reader reader;
	protected Buffer<T> buffer;
	protected Vector<Analyzer<T>> analyzers = new Vector<Analyzer<T>>();
	
	public AbstractSensor(Reader reader, Buffer<T> buffer) {
		super();
		this.reader = reader;
		this.buffer = buffer;
	}

	public void addAnalyzer(Analyzer<T> analyzer) {
		analyzers.add(analyzer);
		buffer.addConsumer((Consumer<T>) analyzer);
	}

	public void start() {
		reader.start();
	}
	
	public void stop() {
		reader.stop();
	}
	
}
