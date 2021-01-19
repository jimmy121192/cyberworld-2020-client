import React, { useContext, useState } from "react";
import { gql, useMutation } from '@apollo/client';
import { Button, Form } from "semantic-ui-react";

import { AuthContext } from '../context/auth'
import { useForm } from "../actions/hooks";
function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    // update(proxy, result){
    update(proxy, { data : { login: userData }}) { //destructuring result obj
        console.log(userData);
        context.login(userData);
      //after register successfuly, go to the homepage
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }
  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>LOGIN</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          value={values.username}
          error={errors.username ? true : false}
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

        <Button type="submit" primary>
          Login
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

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
export default Login;
