package org.testrails.satellite.sensors.readers;

import java.io.File;

import org.apache.commons.io.input.Tailer;
import org.apache.commons.io.input.TailerListener;
import org.testrails.satellite.sensors.buffer.Receiver;

import com.google.inject.Inject;

public class FileTailer extends AbstractReader<String> implements TailerListener {

	protected Tailer tailer;

	@Inject
	public FileTailer(@FileLocation String fileLocation, Receiver<String> buffer) {
		super(buffer);
		this.tailer = new Tailer(new File(fileLocation), this);
	}

	public void start() {
		
		Thread thread = new Thread(tailer);
		thread.start();
		
	}
	
	public void stop() {
		if (tailer != null) {
			tailer.stop();
		}
	}

	public void handle(String line) {
		buffer.provide(line);
	}

	@Override
	public void init(Tailer tailer) {
	}

	@Override
	public void fileNotFound() {
	}

	@Override
	public void fileRotated() {
	}

	@Override
	public void handle(Exception ex) {
	}

}
