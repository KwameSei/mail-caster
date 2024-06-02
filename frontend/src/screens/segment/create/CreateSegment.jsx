import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress, TextField } from '@mui/material';
import { getSegment } from '../../../state-management/segmentSlice';
import { BlueButton } from '../../../components/buttons/Buttons';

const CreateSegment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const segment = useSelector((state) => state.segment.segment);
  const token = useSelector((state) => state.user.token);
  const URL = import.meta.env.VITE_SERVER_URL;

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [description, setDescripton] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const fields = {
    name, description
  }

  // Registering a new student
  const createSegment = async (e) => {
    if (!name) {
      setNameError('Segment name is required');
    } else {
      setNameError('');
    }

    if (!description) {
      setDescriptionError('Segment description is required');
    } else {
      setDescriptionError('');
    }

    setLoading(true);

    try {
      const res = await axios.post(`${URL}/api/v1/segments/create-segment/`, fields, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('req.headers:', req.headers);
      console.log('Response after registration:', res);

      const segmentData = res.data.data;

      if (res.data.message) {
        setError(res.data.message);
        setLoading(false);
      } else {
        setLoading(false);
        setOpenPopup(true);
        dispatch(getSegment(segmentData));
        setName('');
        setDescripton('');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    createSegment(e);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  } 

  const handleDescriptionChange = (e) => {
    setDescripton(e.target.value);
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <h3>Create Segment</h3>
          <div>
            <TextField
              id="name"
              label="Segment name"
              variant="outlined"
              value={name}
              onChange={handleNameChange}
              error={nameError ? true : false}
              helperText={nameError}
            />
            <TextField
              id="description"
              label="Segment description"
              variant="outlined"
              value={description}
              onChange={handleDescriptionChange}
              error={descriptionError ? true : false}
              helperText={descriptionError}
            />
          </div>
          <div>
            <BlueButton type="submit" disabled={loading}>
              {loading ? <CircularProgress color='inherit' size='1.5rem' /> : 'Create'}
            </BlueButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateSegment;