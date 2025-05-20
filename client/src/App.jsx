import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react'
import { Container, Row, Alert, Spinner } from 'react-bootstrap';
import './App.css'
import { Outlet, Route, Routes, Navigate} from 'react-router-dom';
import Intestazione from './components/Header'
import Fase0 from './components/Fase0'
import Fase1 from './components/Fase1'
import Fase2 from './components/Fase2'
import Fase3 from './components/Fase3'
import LoginForm  from './components/Autenticazione';
import NotFound from './components/NotFound';
import { getBudget, getFase, logIn, logOut, getUserInfo } from './API.mjs';

function App() {
  const [fase, setFase] = useState(0);
  const [budget, setBudget] = useState(0);
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  //inizializza il budget
  useEffect(()=> {
    const leggiBudget = async ()=>{
      const bud = await getBudget();
      setBudget(bud);
    }
    leggiBudget();
  }, []);

  //inizializza la fase
  useEffect(()=> {
    const leggiFase = async ()=>{
      const phase = await getFase();
      setFase(phase);
      setLoading(false);
    }
    leggiFase();  
  }, []);

  //check se l' utente è autenticato
  useEffect(() => {
    const checkAuth = async () => {
      try{
        const user = await getUserInfo();
        setLogin(true);
        setUser(user);
      } catch(err){
        console.error("No previous session available.");
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async(credentials) => {
    try {
      const user = await logIn(credentials);
      setLogin(true);
      setMessage({msg: `Welcome back ${user.username}!`, type: 'success'});
      setUser(user);
    } catch (err) {
      setMessage({msg: err, type: 'danger'})
    }
  };

  const handleLogout = async() => {
    await logOut();
    setLogin(false);
    setMessage('');
    Navigate('/');
  };

  if (loading) {
    return (
      <Container className="d-flex min-vh-100 justify-content-center align-items-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Routes>
      <Route element= {<>
        <Intestazione budget = {budget} fase = {fase} login = {login} handleLogout = {handleLogout}/>
        <Container fluid className='mt-3'>
          {message && <Row>
            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
          </Row> }
          <Outlet/>
        </Container>
        </>
      }>
        <Route path="/" element={<Navigate replace to={`/fase${fase}`} />} />
        <Route path="/fase0" element={<Fase0 budget={budget} fase = {fase} setBudget={setBudget} setFase={setFase} user={user} login={login} />} />
        <Route path="/fase1" element={<Fase1 budget={budget} fase = {fase} setFase={setFase} user={user} login={login} />} />
        <Route path="/fase2" element={<Fase2 fase = {fase} setFase={setFase} user={user} login={login} />} />
        <Route path="/fase3" element={<Fase3 budget={budget} setBudget={setBudget} fase = {fase} setFase={setFase} user={user} login={login} />} />
        <Route path='/login' element={login ? <Navigate replace to='/' /> : <LoginForm handleLogin={handleLogin} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
