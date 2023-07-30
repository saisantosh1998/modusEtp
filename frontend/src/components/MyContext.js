import React, { createContext, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = (props) => {
  const [addedUser, setAddedUser] = useState(false);
  const [phoneEditError, setPhoneEditError] = useState(false);



  return (
    <MyContext.Provider value={{ addedUser, setAddedUser,phoneEditError, setPhoneEditError}}>
      {props.children}
    </MyContext.Provider>
  );
};