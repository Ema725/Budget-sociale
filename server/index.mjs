// imports
import express from 'express';
import morgan from 'morgan';
import { deleteProposta, deleteAllProposte, getMiglioriProposte, getProposte, postProposta, updateProposta, addVote, removeVote } from './proposte-DAO.mjs';
import {check, validationResult} from 'express-validator';
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import { getFase, setFase, setBudget, getBudget} from './dati-DAO.mjs';
import { getVoti, postVoto, deleteVoto, deleteAllVoti } from './voti-DAO.mjs';
import { getUser, getAllUsers } from './user-DAO.mjs';

// init express
const app = new express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));

//cors
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

//set up localstrategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "shhhh.... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

/* ROUTES */

// GET /api/proposte
app.get('/api/proposte', (req, res)=>{
  getProposte()
  .then(proposte => res.json(proposte))
  .catch(()=> res.status(500).end())
})

// GET /api/proposte/best
app.get('/api/proposte/best', (req, res)=>{
  getMiglioriProposte()
  .then(proposte => res.json(proposte))
  .catch(()=> res.status(500).end())
})

// POST /api/proposte
app.post('/api/proposte', isLoggedIn ,[
  check('text').notEmpty(),
  check('budget').isNumeric(),
  check('userID').isNumeric(),
  check('rating').isNumeric()
], async (req, res)=>{
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const newProposta = req.body;

  try {
    const id = await postProposta(newProposta);
    console.log("id in index: ", id);
    res.status(201).json({ id });
  } catch(e){
    console.error(`ERROR: ${e.message}`);
    res.status(503).json({error: 'Impossibile creare la proposta.'});
  }
})


// PUT /api/proposte
app.put('/api/proposte', isLoggedIn, [
  check('id').notEmpty().isNumeric(),
  check('text').notEmpty(),
  check('budget').isNumeric(),
  check('userID').isNumeric(),
  check('rating').isNumeric()
], (req, res) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const propostaAggiornata = req.body;

  try{
    updateProposta(propostaAggiornata);
    res.status(200).json({ message: 'Proposta modificata' });
  }catch(err){
    console.error('Error updating proposta:', err.message);
    res.status(503).json({'error': `Impossibile aggiornare la proposta #${req.params.id}.`, details: err.message});
  }
})

// DELETE /api/proposte/:id
app.delete('/api/proposte/:id', isLoggedIn, [check('id').isNumeric()], async (req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const idProposta = req.params.id;

  try{
    await deleteProposta(idProposta);
    res.status(200).end();
  }catch{
    res.status(503).json({'error': `Impossibile eliminare la proposta #${req.params.id}.`});
  }
})

//DELETE /api/proposte
app.delete('/api/proposte', isLoggedIn, async (req, res) => {
  try {
    const result = await deleteAllProposte();
    res.status(200).json({ message: 'Tutte le proposte sono state eliminate.' });
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    res.status(503).json({ error: 'Impossibile eliminare tutte le proposte.' });
  }
});


//PUT /api/proposte/:id/vote
app.put('/api/proposte/:id/vote', isLoggedIn, [
  check('id').isNumeric(),
  check('voto').isNumeric().isInt({ min: 1, max: 3 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { id, voto } = req.body;

  try {
    const result = await addVote(id, voto);
    res.status(200).json({ message: result });
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    res.status(503).json({ error: 'Impossibile aggiungere il voto.' });
  }
});


//PUT /api/proposte/:id/revoke-vote
app.put('/api/proposte/:id/revoke-vote', isLoggedIn, [
  check('id').isNumeric(),
  check('voto').isNumeric().isInt({ min: 1, max: 3 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { id, voto } = req.body;

  try {
    const result = await removeVote(id, voto);
    res.status(200).json({ message: result });
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    res.status(503).json({ error: 'Impossibile revocare il voto.' });
  }
});

//PUT /api/fase
app.put('/api/fase', isLoggedIn, [
  check('fase').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const fase = req.body.fase;

  try {
    const changes = await setFase(fase);
    res.status(200).json({ changes });
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    res.status(503).json({ error: 'Impossibile aggiornare la fase.' });
  }
});

//PUT /api/budget
app.put('/api/budget', isLoggedIn, [
  check('budget').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const budget = req.body.budget;

  try {
    const changes = await setBudget(budget);
    res.status(200).json({ changes });
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    res.status(503).json({ error: 'Impossibile aggiornare il budget.' });
  }
});

//GET /api/budget
app.get('/api/budget', async (req, res) => {
  try {
    const budget = await getBudget();
    res.status(200).json({ budget });
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    res.status(503).json({ error: 'Impossibile ottenere il budget.' });
  }
});

//GET /api/fase
app.get('/api/fase', async (req, res) => {
  try {
    const fase = await getFase();
    res.status(200).json({ fase });
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    res.status(503).json({ error: 'Impossibile ottenere la fase.' });
  }
});

//GET /api/voti
app.get('/api/voti', async (req, res) => {
  try {
      const voti = await getVoti();
      res.status(200).json(voti);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

//POST /api/voti
app.post('/api/voti',isLoggedIn, [
  check('propostaid').isNumeric(),
  check('userid').isNumeric(),
  check('voto').isInt({ min: 1, max: 3 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }

  const voto = req.body;

  try {
      await postVoto(voto);
      res.status(201).json({ message: 'Voto inserito correttamente' });
  } catch (err) {
      res.status(503).json({ error: 'Impossibile inserire il voto.' });
  }
});

//DELETE api/voti
app.delete('/api/voti',isLoggedIn, [
  check('propostaid').isNumeric(),
  check('userid').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }

  const voto = req.body;

  try {
      await deleteVoto(voto);
      res.status(200).json({ message: 'Voto eliminato correttamente' });
  } catch (err) {
      res.status(503).json({ error: 'Impossibile eliminare il voto.' });
  }
});

//DELETE /api/voti/all
app.delete('/api/voti/all',isLoggedIn, async (req, res) => {
  try {
      await deleteAllVoti();
      res.status(200).json({ message: 'Tutti i voti sono stati eliminati.' });
  } catch (err) {
      res.status(503).json({ error: 'Impossibile eliminare tutti i voti.' });
  }
});

//GET /api/utenti
app.get('/api/utenti', async (req, res) => {
  try {
      const utenti = await getAllUsers();
      res.status(200).json(utenti);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

//POST /api/sessions
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        return res.status(401).send(info);
      }
      req.login(user, (err) => {
        if (err)
          return next(err);
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

//GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

//DELETE /api/sessions/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});