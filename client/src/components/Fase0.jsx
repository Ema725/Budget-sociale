import { Row, Col, Container, Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { aggiornaBudget, aggiornaFase } from '../API.mjs';

function Fase0(props) {
    const [budget, setBudget] = useState(1000);
    const navigate = useNavigate();

    useEffect(() => {
        if (props.fase !== 0) {
            navigate(`/fase${props.fase}`);
        }
    }, [props.fase, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await aggiornaBudget(budget);
        await aggiornaFase(1);
        props.setBudget(budget);
        props.setFase(1);
        navigate('/fase1');
    };

    return (
        <>
        {props.login && props.user.role === "admin" && <Container className="d-flex min-vh-100 justify-content-center align-items-center">
            <Row className="flex-column align-items-center">
                <Col as='h1' className="text-center">
                    Definire Budget:
                </Col>
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <FormControl type="number" required={true} min="1000" value={budget} onChange={(event) => setBudget(event.target.value)}></FormControl>
                        </FormGroup>
                        <Button type="submit" className="mt-2">Definisci Budget</Button>
                    </Form>
                </Col>
            </Row>           
        </Container>}
        {(!props.login || props.user.role === "user") && <Container className="d-flex min-vh-100 justify-content-center align-items-center">
            <Row className="flex-column align-items-center">
                <Col as='h1' className="text-center">
                    L'admin deve ancora definire il budget...
                </Col>
            </Row>           
        </Container> }
        </>
    );
}

export default Fase0;
