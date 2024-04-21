import React from 'react';
import { Field, ErrorMessage } from 'formik';
import '../index.css'

const NameField = ({ index }) => (
    <div className="name-field">
    <label htmlFor={`name-${index}`}>Name:</label>
    <Field type="text" id={`name-${index}`} name={`cops[${index}].name`} />
    <ErrorMessage name={`cops[${index}].name`} component="div" className="error-message" />
  </div>
);

export default NameField;
