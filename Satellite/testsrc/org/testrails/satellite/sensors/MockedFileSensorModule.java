package org.testrails.satellite.sensors;

import org.testrails.satellite.sensors.buffer.Buffer;
import org.testrails.satellite.sensors.buffer.Receiver;
import org.testrails.satellite.sensors.readers.FileContent;
import org.testrails.satellite.sensors.readers.StringParameterReader;
import org.testrails.satellite.sensors.readers.Reader;

import com.google.inject.AbstractModule;
import com.google.inject.TypeLiteral;

public class MockedFileSensorModule extends AbstractModule {
	
	private final String fileContent;

	public MockedFileSensorModule(String fileContent) {
		super();
		this.fileContent = fileContent;
	}
	
	@Override
	protected void configure() {
		
		bindConstant().annotatedWith(FileContent.class).to(fileContent);
		bind(Reader.class).to(StringParameterReader.class);
		
		Buffer<String> buffer = new Buffer<String>();
		bind(new TypeLiteral<Receiver<String>>() {}).toInstance(buffer);
		bind(new TypeLiteral<Buffer<String>>() {}).toInstance(buffer);
		
	}

}
