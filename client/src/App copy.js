import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CaptureForm = ({ onSubmit }) => {
  const [copData, setCopData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicleData, setVehicleData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehicleResponse, cityResponse] = await Promise.all([
          axios.get('http://localhost:3000/vehicles'),
          axios.get('http://localhost:3000/cities')
        ]);
        setVehicleData(vehicleResponse.data);
        setCityData(cityResponse.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = () => {
    setShowForm(true);
    setCopData([{ name: '', city: '', vehicle: '' }, { name: '', city: '', vehicle: '' }, { name: '', city: '', vehicle: '' }]);
  };

  const handleSubmit = (values, { resetForm }) => {
    onSubmit(values.cops);
    resetForm();
    setShowForm(false);
  };

  const validationSchema = Yup.object().shape({
    cops: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        city: Yup.string().required('City is required'),
        vehicle: Yup.string().required('Vehicle is required')
      })
    )
  });

  useEffect(() => {
    const selectedCities = copData.map((cop) => cop.city);
    const remainingCities = cityData.filter((city) => !selectedCities.includes(city.city));
    setAvailableCities(remainingCities);

    const selectedVehicles = copData.map((cop) => cop.vehicle);
    const vehicleCounts = selectedVehicles.reduce((acc, vehicle) => {
      acc[vehicle] = (acc[vehicle] || 0) + 1;
      return acc;
    }, {});

    const vehiclesWithCount = vehicleData.map(vehicle => ({
      ...vehicle,
      remainingCount: (vehicleCounts[vehicle.kind] !== undefined ? vehicle.count - vehicleCounts[vehicle.kind] : vehicle.count)
    }));
    
    const remainingVehicles = vehiclesWithCount.filter(vehicle => vehicle.remainingCount > 0 || !vehicle.count);
    
    setAvailableVehicles(remainingVehicles);
  }, [copData, cityData, vehicleData]);

  return (
    <div>
      {!showForm && !isLoading && <button onClick={handleButtonClick}>Simulate Cop</button>}
      {showForm && (
        <Formik
          initialValues={{ cops: copData }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              {values.cops.map((cop, index) => {
                const selectedCities = values.cops.reduce((acc, cur, idx) => {
                  if (idx !== index) {
                    acc.push(cur.city);
                  }
                  return acc;
                }, []);
                const remainingCities = availableCities.filter((city) => !selectedCities.includes(city.city));

                const selectedVehicles = values.cops.reduce((acc, cur, idx) => {
                  if (idx !== index) {
                    acc.push(cur.vehicle);
                  }
                  return acc;
                }, []);
                const vehicleCounts = selectedVehicles.reduce((acc, vehicle) => {
                  acc[vehicle] = (acc[vehicle] || 0) + 1;
                  return acc;
                }, {});

                const vehiclesWithCount = vehicleData.map(vehicle => ({
                  ...vehicle,
                  remainingCount: (vehicleCounts[vehicle.kind] !== undefined ? vehicle.count - vehicleCounts[vehicle.kind] : vehicle.count)
                }));
                
                const remainingVehicles = vehiclesWithCount.filter(vehicle => vehicle.remainingCount > 0 || !vehicle.count);
                
                return (
                  <div key={index}>
                    <div>
                      <label htmlFor={`name-${index}`}>Name:</label>
                      <Field
                        type="text"
                        id={`name-${index}`}
                        name={`cops[${index}].name`}
                      />
                      <ErrorMessage name={`cops[${index}].name`} component="div" />
                    </div>
                    <div>
                      <label htmlFor={`city-${index}`}>City:</label>
                      <Field
                        as="select"
                        id={`city-${index}`}
                        name={`cops[${index}].city`}
                      >
                        <option value="">Select City</option>
                        {remainingCities.map((city, idx) => (
                          <option key={idx} value={city.city}>
                            {city.city}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name={`cops[${index}].city`} component="div" />
                    </div>
                    <div>
                      <label htmlFor={`vehicle-${index}`}>Vehicle:</label>
                      <Field
                        as="select"
                        id={`vehicle-${index}`}
                        name={`cops[${index}].vehicle`}
                      >
                        <option value="">Select Vehicle</option>
                        {remainingVehicles.map((vehicle, idx) => (
                          <option key={idx} value={vehicle.kind}>
                            {vehicle.kind}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name={`cops[${index}].vehicle`} component="div" />
                    </div>
                  </div>
                );
              })}
              <button type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default CaptureForm;
