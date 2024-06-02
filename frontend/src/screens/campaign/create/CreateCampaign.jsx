import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Box,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import moment from 'moment-timezone';
import { BlueButton } from '../../../components/buttons/Buttons';
import { getCampaign } from '../../../state-management/campaignSlice';
import { usersAuth, userError, userResponse } from '../../../state-management/userSlice';
import { getSegments, segmentError, segmentResponse } from '../../../state-management/segmentSlice';

import classes from './create-campaign.module.scss';

// Initialize the timezone
const timezones = moment.tz.names().map((tz) => ({
  label: tz,
  value: tz,
}));

const Create = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const URL = import.meta.env.VITE_SERVER_URL;
  const token = localStorage.getItem('token');
  const { campaign, isLoading, response } = useSelector((state) => state.campaign);
  const segments = useSelector((state) => state.segment.segments);
  const users = useSelector((state) => state.user.users);
  console.log(" segments: ", segments);
  console.log(" users: ", users);
  
  const [segment, setSegment] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selectedRecipientsCount, setSelectedRecipientsCount] = useState(0);
  const [selectedRecipientsError, setSelectedRecipientsError] = useState('');
  const [selectedSegmentError, setSelectedSegmentError] = useState('');
  const [selectedRecipientError, setSelectedRecipientError] = useState('');
  // Timezone states
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [selectedTimezoneError, setSelectedTimezoneError] = useState('');

  const [type, setType] = useState('');
  const [typeError, setTypeError] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [content, setContent] = useState('');
  const [contentError, setContentError] = useState('');
  const [status, setStatus] = useState('');
  const [statusError, setStatusError] = useState('');
  const [scheduled_date, setScheduledDate] = useState('');
  const [scheduled_dateError, setScheduledDateError] = useState('');
  const [scheduled_time, setScheduledTime] = useState('');
  const [scheduled_timeError, setScheduledTimeError] = useState('');
  const [scheduled_timezone, setScheduledTimezone] = useState('');
  const [scheduled_timezoneError, setScheduledTimezoneError] = useState('');
  const [error, setError] = useState(null);

  // Fetch users and segments
  useEffect(() => {
    const fetchUsersAndSegments = async () => {
      try {
        const usersRes = await axios.get(`${URL}/api/v1/users/get-users`);
        const segmentRes = await axios.get(`${URL}/api/v1/segments/get-segments`);

        const usersData = usersRes.data.data;
        const segmentsData = segmentRes.data.data;
        console.log('Users data: ', usersData);
        console.log('Segment data', segmentsData);

        dispatch(usersAuth(usersData));
        dispatch(getSegments(segmentsData));
      } catch (error) {
        console.error('Error fetching users or segments:', error);
        toast.error(error.message);
      }
    };
    fetchUsersAndSegments();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSegmentChange = (event) => {
    setSegment(event.target.value);
  };

  const handleSegmentsChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSegments(typeof value === 'string' ? value.split(',') : value);
  };

  const handleRecipientsChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedRecipients(typeof value === 'string' ? value.split(',') : value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handlescheduledChange = (event) => {
    setScheduled(event.target.value);
  };

  const handlescheduledDateChange = (event) => {
    setScheduledDate(event.target.value);
  };

  const handlescheduledTimeChange = (event) => {
    const timeValue = event.target.value;
    console.log("Scheduled Time Input:", timeValue);
    setScheduledTime(timeValue);
  };

  const handlescheduledTimezoneChange = (event) => {
    setScheduledTimezone(event.target.value);
  };

  const handlescheduledTimezoneOffsetChange = (event) => {
    setScheduledTimezoneOffset(event.target.value);
  };

  const handlescheduledTimezoneOffsetValueChange = (event) => {
    setScheduledTimezoneOffsetValue(event.target.value);
  };

  const handlescheduledTimezoneOffsetTypeChange = (event) => {
    setScheduledTimezoneOffsetType(event.target.value);
  };

  const handlescheduledTimezoneOffsetSignChange = (event) => {
    setScheduledTimezoneOffsetSign(event.target.value);
  };

  useEffect(() => {
    if (id) {
      dispatch(get(id));
    }
  }, [dispatch, id]);

  // Timezone variables
  const timezone = selectedTimezone?.value || '';

  // Create s
  const handleCreate = async () => {
    // Validate fields on the frontend before making the request
    let isValid = true;
  
    if (!type) {
      setTypeError('Type is required');
      isValid = false;
    } else {
      setTypeError('');
    }
  
    if (!subject) {
      setSubjectError('Subject is required');
      isValid = false;
    } else {
      setSubjectError('');
    }
  
    if (!content) {
      setContentError('Content is required');
      isValid = false;
    } else {
      setContentError('');
    }
  
    if (!status) {
      setStatusError('Status is required');
      isValid = false;
    } else {
      setStatusError('');
    }
  
    if (!scheduled_date) {
      setScheduledDateError('Scheduled date is required');
      isValid = false;
    } else {
      setScheduledDateError('');
    }
  
    if (!scheduled_time) {
      setScheduledTimeError('Scheduled time is required');
      isValid = false;
    } else {
      setScheduledTimeError('');
    }
  
    if (!selectedTimezone) {
      setSelectedTimezoneError('Scheduled timezone is required');
      isValid = false;
    } else {
      setSelectedTimezoneError('');
    }
  
    if (!selectedSegments.length) {
      setSelectedSegmentError('At least one segment must be selected');
      isValid = false;
    } else {
      setSelectedSegmentError('');
    }
  
    if (!selectedRecipients.length) {
      setSelectedRecipientsError('At least one recipient must be selected');
      isValid = false;
    } else {
      setSelectedRecipientsError('');
    }
  
    if (isValid) {
      try {
        const localDateTime = `${scheduled_date}T${scheduled_time}`;
        const scheduled_datetime = moment.tz(localDateTime, selectedTimezone.value).toISOString();
  
        const fields = {
          type,
          subject,
          content,
          status,
          scheduled_date,
          scheduled_time,
          scheduled_datetime,
          scheduled_timezone: selectedTimezone.value,
          segment_id: selectedSegments,
          user_id: selectedRecipients,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
  
        const response = await axios.post(`${URL}/api/v1/campaigns/create-campaign`, fields, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (response.status === 201) {
          dispatch(getCampaign(response.data));
          toast.success(response.data.message);
          navigate('/campaigns');
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };  

  const handleUpdate = async () => {
    if (!type) {
      setTypeError('Type is required');
    } else {
      setTypeError('');
    }

    if (!subject) {
      setSubjectError('Subject is required');
    } else {
      setSubjectError('');
    }

    if (!content) {
      setContentError('Content is required');
    } else {
      setContentError('');
    }

    if (!status) {
      setStatusError('Status is required');
    } else {
      setStatusError('');
    }

    if (!scheduled_date) {
      setScheduledDateError('Scheduled date is required');
    } else {
      setScheduledDateError('');
    }

    if (!scheduled_time) {
      setScheduledTimeError('Scheduled time is required');
    } else {
      setScheduledTimeError('');
    }

    if (!selectedTimezone) {
      setSelectedTimezoneError('Scheduled timezone is required');
    } else {
      setSelectedTimezoneError('');
    }

    if (!selectedSegments.length) {
      setSelectedSegmentError('At least one segment must be selected');
    } else {
      setSelectedSegmentError('');
    }

    if (!selectedRecipients.length) {
      setSelectedRecipientsError('At least one recipient must be selected');
    } else {
      setSelectedRecipientsError('');
    }

    if (
      !typeError &&
      !subjectError &&
      !contentError &&
      !statusError &&
      !scheduled_dateError &&
      !scheduled_timeError &&
      !selectedTimezoneError &&
      !selectedSegmentError &&
      !selectedRecipientsError
    ) {
      try {
        // Combine date and time into a single ISO string, then convert to UTC
        const localDateTime = `${scheduled_date}T${scheduled_time}`;
        const scheduled_datetime = moment.tz(localDateTime, selectedTimezone.value).toISOString();

        const fields = {
          type,
          subject,
          content,
          status,
          scheduled_datetime,
          scheduled_timezone: selectedTimezone.value,
          segment_id: selectedSegments,
          user_id: selectedRecipients,
        };

        const response = await axios.put(`${URL}/api/v1/campaigns/update-campaign/${id}`, fields, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          dispatch(getCampaign(response.data));
          toast.success(response.data.message);
          navigate('/campaigns');
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }

  return (
    <div className={classes.create}>
      <h1>{id ? 'Update ' : 'Create '}</h1>
      <div className={classes.createForm}>
        <Box className={classes.items}>
          <FormControl fullWidth>
            <InputLabel id="segment-select-label">Select Segments</InputLabel>
            <Select
              labelId="segment-select-label"
              multiple
              value={selectedSegments}
              onChange={handleSegmentsChange}
              renderValue={(selected) => selected.map((id) => segments.find((s) => s.id === id)?.name).join(', ')}
            >
              {segments.map((segment) => (
                <MenuItem key={segment.id} value={segment.id}>
                  <Checkbox checked={selectedSegments.indexOf(segment.id) > -1} />
                  <ListItemText primary={segment.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box className={classes.items}>
          <FormControl fullWidth>
            <InputLabel id="user-select-label">Select Users</InputLabel>
            <Select
              labelId="user-select-label"
              multiple
              value={selectedRecipients}
              onChange={handleRecipientsChange}
              renderValue={(selected) => selected.map((id) => {
                const user = users.find((u) => u.id === id);
                return `${user.first_name} ${user.last_name}`;
              }).join(', ')}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Checkbox checked={selectedRecipients.indexOf(user.id) > -1} />
                  <ListItemText primary={`${user.first_name} ${user.last_name}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {/* <Select
          labelId="type-select-label"
          id="type-select"
          value={type}
          onChange={handleTypeChange}
          error={typeError ? true : false}
          helperText={typeError}
        >
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="sms">SMS</MenuItem>
          <MenuItem value="push">Push</MenuItem>
        </Select> */}
        <FormControl fullWidth>
          <InputLabel id="type-select-label">Type</InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            value={type}
            onChange={handleTypeChange}
            error={typeError ? true : false}
            renderValue={(selected) => selected}
          >
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="sms">SMS</MenuItem>
            <MenuItem value="push">Push</MenuItem>
          </Select>
          {typeError && <p className="error">{typeError}</p>}
        </FormControl>
        <TextField
          id="Subject"
          label=" Subject"
          variant="outlined"
          value={subject}
          onChange={handleSubjectChange}
          error={subjectError ? true : false}
          helperText={subjectError}
        />
        <TextField
          id="Content"
          label=" Content"
          variant="outlined"
          value={content}
          onChange={handleContentChange}
          error={contentError ? true : false}
          helperText={contentError}
        />
        <FormControl fullWidth>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={status}
            onChange={handleStatusChange}
            error={statusError ? true : false}
            renderValue={(selected) => selected}
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="sent">Sent</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
          </Select>
          {statusError && <p className="error">{statusError}</p>}
        </FormControl>
        <TextField
          label="Scheduled Date"
          type="date"
          fullWidth
          margin="normal"
          value={scheduled_date}
          onChange={handlescheduledDateChange}
          error={!!scheduled_dateError}
          helperText={scheduled_dateError}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Scheduled Time"
          type="time"
          fullWidth
          margin="normal"
          value={scheduled_time}
          onChange={handlescheduledTimeChange}
          error={!!scheduled_timeError}
          helperText={scheduled_timeError}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl fullWidth>
          <InputLabel id="timezone-label">Timezone</InputLabel>
          <Select
            labelId="timezone-label"
            id="timezone-select"
            value={selectedTimezone?.value || ''}
            onChange={(e) => {
              const selected = timezones.find((tz) => tz.value === e.target.value);
              setSelectedTimezone(selected);
            }}
            error={Boolean(scheduled_timezoneError)}
            renderValue={(selected) => selected}
          >
            {timezones.map((timezone) => (
              <MenuItem key={timezone.value} value={timezone.value}>
                {timezone.label}
              </MenuItem>
            ))}
          </Select>
          {scheduled_timezoneError && <p className="error">{scheduled_timezoneError}</p>}
        </FormControl>
        
        <div className={classes.createButtons}>
          <BlueButton onClick={id ? handleUpdate : handleCreate}>{id ? 'Update ' : 'Create '}</BlueButton>
          <Link to='/s'>
            <BlueButton>Cancel</BlueButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Create;