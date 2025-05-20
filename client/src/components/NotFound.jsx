import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


export default function NotFound() {
    const navigate = useNavigate();

    return(
        <Container className="d-flex min-vh-100 justify-content-center align-items-center">
            <Row className="flex-column align-items-center">
                <Col as='h1' className="text-center">
                    Route sbagliata 🙁, per favore ritorna alla home:
                </Col>
            </Row>
            <Button style={{fontSize: '24px'}} onClick={()=>navigate('/')}> <i className="bi bi-house-fill"/> Main menu</Button>
        </Container>
    );
}