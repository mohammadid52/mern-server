module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "Username cannot be empty";
  }

  if (email.trim() === "") {
    errors.email = "email cannot be empty";
  } else {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(regex)) {
      errors.email = "Invalid email address";
    }
  }

  if (password === "") {
    errors.password = "password cannot be empty";
  } else {
    if (password.length < 6) {
      errors.password = "password must be at least 6 characters";
    } else {
      if (confirmPassword !== password) {
        errors.confirmPassword = "confirm password does not match";
      }
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "Username cannot be empty";
  }

  if (password === "") {
    errors.password = "password cannot be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validatePost = (body) => {
  const errors = {};
  if (body.trim() === "") {
    errors.body = "Body cannot be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
