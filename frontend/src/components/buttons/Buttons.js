import styled from 'styled-components';
import { Button } from '@mui/material';

export const BlueButton = styled(Button)`
  && {
    background-color: #1976d2;
    color: white;
    font-weight: 600;
    font-size: 16px;
    padding: 10px 20px;
    border-radius: 5px;
    text-transform: none;
    &:hover {
      background-color: #1565c0;
    }
  }
`;

export const GreenButton = styled(Button)`
  && {
    background-color: #4caf50;
    color: white;
    font-weight: 600;
    font-size: 16px;
    padding: 10px 20px;
    border-radius: 5px;
    text-transform: none;
    &:hover {
      background-color: #388e3c;
    }
  }
`;

export const RedButton = styled(Button)`
  && {
    background-color: #f44336;
    color: white;
    font-weight: 600;
    font-size: 16px;
    padding: 10px 20px;
    border-radius: 5px;
    text-transform: none;
    &:hover {
      background-color: #d32f2f;
    }
  }
`;