/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Form, } from 'formik';
import * as Yup from 'yup';
import Button from './components/Button';
import NameField from './components/NameField';
import CityField from './components/CityField';
import VehicleField from './components/VehicleField';
import './index.css'

const CaptureForm = ({ onSubmit }) => {
  // const [copData, setCopData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [response, setResponse] = useState(null);
  const [showPopup, setShowPopup] = useState(false); 
  const [responseMessage, setResponseMessage] = useState(false); 

  const [copData, setCopData] = useState([
    { name: '', city: '', vehicle: '' },
    { name: '', city: '', vehicle: '' },
    { name: '', city: '', vehicle: '' }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehicleResponse, cityResponse] = await Promise.all([
          axios.get('http://localhost:3000/vehicles'),
          axios.get('http://localhost:3000/cities')
        ]);
        setVehicleData(vehicleResponse.data);
        setAvailableCities(cityResponse.data);

      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleSubmit = (values, { resetForm }) => {
    console.log("Values:", values);

    axios.post('http://localhost:3000/simulate', { cops: values.cops })
      .then(response => {
        // Set the response data in the state variable
        setResponse(response.data);
        resetForm();
        setCopData([
          { name: '', city: '', vehicle: '' },
          { name: '', city: '', vehicle: '' },
          { name: '', city: '', vehicle: '' }
        ]);
        setShowPopup(true);
        setResponseMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error:', error);
      });

  };

  console.log("response:", response)


  const validationSchema = Yup.object().shape({
    cops: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        city: Yup.string().required('City is required'),
        vehicle: Yup.string().required('Vehicle is required')
      })
    )
  });

  const handleClearButtonClick = (resetForm) => {
    resetForm();
    setCopData([
      { name: '', city: '', vehicle: '' },
      { name: '', city: '', vehicle: '' },
      { name: '', city: '', vehicle: '' }
    ]);
  };



  return (
    <div className='capture-form-container'>
      {!showForm && !isLoading && <Button type="submit" name="Generate Fearless Cops" onClick={handleButtonClick} />}
      {showForm && (
        <div className='capture-form'>

          <Formik
            initialValues={{ cops: copData }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ resetForm,values }) => (
              <Form>
                <div className='reset-btn'>
                  <Button onClick={() => handleClearButtonClick(resetForm)} name="Reset" />
                </div>

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
                    <div className='card' key={index}>
                      <NameField index={index} />
                      <CityField index={index} remainingCities={remainingCities} />
                      <VehicleField index={index} remainingVehicles={remainingVehicles} />
                    </div>
                  );
                })}
                <div className='form-btn' >
                  <Button type="submit" name="Find the criminal" />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
       {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={() => setShowPopup(false)}>&times;</span>
            <p>{responseMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptureForm;
