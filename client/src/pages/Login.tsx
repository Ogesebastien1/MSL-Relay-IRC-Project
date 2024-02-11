import {Row, Col} from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const Login = () => {

    const {loginUser, loginError, loginInfo, updateLoginInfo, isLoginLoading, handleAccessAsGuest } = useContext(AuthContext);
 
    return (
     <>

        <Form onSubmit={loginUser}>
            <Row 
                style={{
                    height : "100vh",
                    justifyContent: "center",
                    paddingTop: "10%",
                }}>
                <Col xs ={6}>
                <Stack gap={3}>
                    <h2>Login</h2>
                    <Form.Control type="email" 
                                placeholder="Email" 
                                onChange ={(e) => 
                                updateLoginInfo ({...loginInfo, email: e.target.value})
                                }
                                />
                    <Form.Control type="password" 
                                placeholder="Password"  
                                onChange ={(e) => 
                                updateLoginInfo ({...loginInfo, password: e.target.value})}/>
                    <Button variant ="primary" type="submit">
                       {isLoginLoading? "Getting you in ..." : "Login"}
                    </Button>
                        
                        {loginError?.error  && <Alert variant="danger">
                        <p>{loginError?.message}</p>
                        </Alert>}
                        <Button variant="outline-secondary" type="button" onClick={handleAccessAsGuest}>
                        Access as Guest
                        </Button>
                </Stack>
                </Col>
            </Row>

        </Form>
    </> )
}
 
export default Login;