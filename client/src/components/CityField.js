import React from 'react';
import { Field, ErrorMessage } from 'formik';
import '../index.css'

const CityField = ({ index, remainingCities }) => (
    <div className="select-field">
    <label htmlFor={`city-${index}`}>City:</label>
    <Field as="select" id={`city-${index}`} name={`cops[${index}].city`}>
      <option value="">Select City</option>
      {remainingCities.map((city, idx) => (
        <option key={idx} value={city.city}>
          {city.city}
        </option>
      ))}
    </Field>
    <ErrorMessage name={`cops[${index}].city`} component="div" className="error-message" />
  </div>
);

export default CityField;
