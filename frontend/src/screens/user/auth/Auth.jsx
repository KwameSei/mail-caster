import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { BlueButton } from '../../../components/buttons/Buttons';
import { userAuth, userError, userLoading } from '../../../state-management/userSlice';

import classes from './auth.module.scss';

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [title, setTitle] = useState('Sign In');
  const URL = import.meta.env.VITE_SERVER_URL;

  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [segment_id, setSegmentId] = useState('');
  const [is_admin, setIsAdmin] = useState(false);
  
  const currentUser = useSelector((state) => state.user.currentUser);
  const isLoading = useSelector((state) => state.user.isLoading);
  const error = useSelector((state) => state.user.error);
  const token = useSelector((state) => state.user.token);
  const role = useSelector((state) => state.user.currentRole);

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const isLoggedIn = !isRegistered;

  // Use useEffect to check if user is already authenticated and change the title of the page
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }

    if (isRegistered) {
      setTitle('Sign Up');
    } else {
      setTitle('Sign In');
    }
  }, [currentUser, navigate, isRegistered]);

  // Use useEffect to check if there is an error and display a toast message
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const fields = [
    first_name,
    last_name,
    email,
    password,
    confirmPassword,
    segment_id
  ];

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async () => {
    dispatch(userLoading());
    if (password !== confirmPassword) {
      dispatch(userError('Passwords do not match'));
      return;
    }

    try {
      const response = await axios.post(`${URL}/api/v1/users/signup-user`, fields, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const user = response.data.data;
      console.log('User data', user);

      dispatch(userAuth(user));
      isLoading(false);
      toast.success('User registered successfully');
      navigate('/');
    } catch (error) {
      console.error('Error registering user', error);
      dispatch(userError(error.response.data.message));
      toast.error(error.message);
      isLoading(false);
    }
  };

  const handleLogin = async () => {
    dispatch(userLoading());
    try {
      const response = await axios.post(`${URL}/api/v1/users/login-user`, fields, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const user = response.data.data;
      console.log('User data', user);

      dispatch(userAuth(user));
      isLoading(false);
      toast.success('User logged in successfully');
      navigate('/');
    } catch (error) {
      console.error('Error logging in user', error);
      dispatch(userError(error.response.data.message));
      toast.error(error.message);
      isLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegistered) {
      handleRegister();
    } else {
      handleLogin();
    }
  }
  
  return (
    <div className={classes.auth}>
      <div className={classes.authContainer}>
        <h1>{title}</h1>
        <form className={classes.authForm} onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            variant="outlined"
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            label="Last Name"
            variant="outlined"
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {isRegistered && (
            <TextField
              label="Confirm Password"
              variant="outlined"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowConfirmPassword}>
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
          {isRegistered && (
            <TextField
              label="Segment ID"
              variant="outlined"
              type="text"
              value={segment_id}
              onChange={(e) => setSegmentId(e.target.value)}
              required
            />
          )}
          <div className={classes.authButtons}>
            <BlueButton type="submit">
              {isLoading ? <CircularProgress size={24} /> : title}
            </BlueButton>
            <Link to="#" onClick={() => setIsRegistered(!isRegistered)}>
              {isRegistered ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
            </Link>
          </div>
        </form>

        <Dialog open={error} onClose={() => dispatch(userError(null))}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <DialogContentText>{error}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <BlueButton onClick={() => dispatch(userError(null))}>Close</BlueButton>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Auth;