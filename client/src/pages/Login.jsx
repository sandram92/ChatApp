import { Alert, Button, Form, Row, Stack, Col } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const {
    user,
    loginInfo,
    updateLoginInfo,
    loginUser,
    loginError,
    isLoginLoading,
  } = useContext(AuthContext);
  return (
    <>
      <Form onSubmit={loginUser}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2 className="text-white">Login</h2>
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, email: e.target.value })
                }
              />
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, password: e.target.value })
                }
              />
              <Button variant="primary" type="submit">
                {isLoginLoading ? "Logging in" : "Login"}
              </Button>
              {loginError && loginError.error && (
                <Alert variant="danger">{loginError.message}</Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Login;
// Compare this snippet from client/src/pages/Login.jsx:
