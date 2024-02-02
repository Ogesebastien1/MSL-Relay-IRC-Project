import {Row, Col} from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

const Login = () => {
    return <>
    <Form>
        <Row 
            style={{
                height : "100vh",
                justifyContent: "center",
                paddingTop: "10%",
            }}>
            <Col xs ={6}>
            <Stack gap={3}>
                <h2>Login</h2>
                <Form.Control type="email" placeholder="Email"/>
                <Form.Control type="password" placeholder="Password"/>
                <Button variant ="primary" type="submit">
                    Login
                </Button>

                <Alert variant="danger">
                    <p>An error occured</p>
                    </Alert>
            </Stack>
            </Col>
        </Row>
    </Form>
    </> 
}
 
export default Login;