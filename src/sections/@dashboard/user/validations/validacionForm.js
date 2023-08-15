export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.{5,})/;
    return passwordRegex.test(password);
  };

  export const validateDocument = (document) => {
    return document.length >= 10 && !isNaN(document);
  };

  export const validateName = (name) => {
    return name.length >= 4;
  };
  
  export const validateLastName = (lastName) => {
    return lastName.length >= 5;
  };
  
  export const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^\d{8,}$/;
    return phoneNumberRegex.test(phoneNumber);
  };