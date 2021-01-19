import React, { useContext, useState } from "react";
import { gql, useMutation } from '@apollo/client';
import { Button, Form } from "semantic-ui-react";

import { AuthContext } from '../context/auth'
import { useForm } from "../actions/hooks";
function Register(props) {
  const context = useContext(AuthContext);

  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(registerUserCallback, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    // update(proxy, result){
    update(proxy, { data : { register: userData }}) { //destructuring result obj
      context.login(userData); //after register is login, so use login action in the reducer
      console.log(userData);
      //after register successfuly, go to the homepage
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });
  
  //to prevent addUser() is not recognized in useForm callback => call addUser() outside a const function
  function registerUserCallback() {
    addUser();
  }
  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        ></Form.Input>
        <Form.Input
          label="Email"
          placeholder="Email"
          name="email"
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
        ></Form.Input>
        <Form.Input
          label="Password"
          type="password"
          placeholder="Password"
          name="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        ></Form.Input>
        <Form.Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        ></Form.Input>

        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
export default Register;
