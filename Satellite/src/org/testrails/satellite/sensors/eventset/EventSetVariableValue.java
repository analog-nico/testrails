package org.testrails.satellite.sensors.eventset;

import java.util.List;
import java.util.Vector;

public class EventSetVariableValue {

	protected List<Object> values = new Vector<Object>();
	
	public EventSetVariableValue() {
		super();
	}
	
	public EventSetVariableValue(Object firstValue) {
		super();
		values.add(firstValue);
	}
	
	public void setValue(Object value) {
		if (values.size() > 0) {
			values.clear();
		}
		values.add(value);
	}
	
	public void appendValue(Object value) {
		values.add(value);
	}
	
	public void setValues(List<Object> values) {
		
		if (values == null) {
			this.values.clear();
			return;
		}
		
		this.values = values;
	}
	
	public void appendValues(List<Object> values) {
		values.addAll(values);
	}
	
	public List<Object> getValues() {
		return values;
	}
	
	public String toString() {
		
		String str = "";
		
		for (int i = 0; i < values.size(); i++) {
			
			if (i > 0) {
				str += "\n";
			}
			
			str += values.get(i).toString();
			
		}
		
		return str;
		
	}

}
