import React from 'react';
import { Field, ErrorMessage } from 'formik';

const VehicleField = ({ index, remainingVehicles }) => (
    <div className="select-field">
    <label htmlFor={`vehicle-${index}`}>Vehicle:</label>
    <Field as="select" id={`vehicle-${index}`} name={`cops[${index}].vehicle`}>
      <option value="">Select Vehicle</option>
      {remainingVehicles.map((vehicle, idx) => (
        <option key={idx} value={vehicle.kind}>
          {vehicle.kind}
        </option>
      ))}
    </Field>
    <ErrorMessage name={`cops[${index}].vehicle`} component="div" className="error-message" />
  </div>
);

export default VehicleField;
