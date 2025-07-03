import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import Main from './Main';
import { Route, Routes } from 'react-router-dom';
import UserList from './UserList';
import BookingPage from './BookingPage';
import ReturnBooks from './ReturnBook';
import UserListR from './UserListR';
import VerifyBookingPage from './VerifyBookingsPage';
// import { Logo } from './Logo';

function App() {
  return (
    <ChakraProvider theme={theme}>
     
      
    <Routes>
    <Route path='/' element={<Main/> }/><Route path='/users' element={<UserList/>}/>
    <Route path='/booking' element={<BookingPage/> }/>
    <Route path='/return' element={<ReturnBooks/> }/>
    <Route path='/return-page' element={<UserListR/> }/>
    <Route path='/verify/:id' element={<VerifyBookingPage/>}/>
    
    </Routes>
    </ChakraProvider>
  );
}

export default App;
