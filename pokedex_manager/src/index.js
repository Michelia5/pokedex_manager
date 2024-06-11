import express from 'express';
import path from 'path';
import fetch from 'node-fetch'; 
import bodyParser from 'body-parser';


const app = express();
const __dirname = path.resolve();

// Imposta il motore di visualizzazione EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Imposta il percorso della cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Aggiungi un middleware per parsare i dati del modulo di ricerca
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Route per le varie pagine
app.get('/home', (req, res) => {
   res.render('pages/home');
});

app.get('/privacy', (req, res) => {
   res.render('pages/privacy');
});

app.get('/termini', (req, res) => {
   res.render('pages/termini');
});

app.get('/informazioni', (req, res) => {
   res.render('pages/informazioni');
});


app.get('/pokemon', async (req, res) => {
   try {
       const response = await fetch('http://localhost:8000/pokemon');
       const data = await response.json();
       res.render('pages/pokemon', { pokemons: data });
   } catch (error) {
       console.error('Errore nel recupero dei dati dei Pokémon:', error);
       res.status(500).send('Errore nel recupero dei dati dei Pokémon');
   }
});


// Route per la pagina dettagliata del Pokémon
app.get('/pokemon/:id', async (req, res) => {
   try {
       const pokemonId = req.params.id;
       // Recupera i dettagli del Pokémon dal backend
       const response = await fetch(`http://localhost:8000/pokemon/${pokemonId}`);
       const pokemonData = await response.json();
       // Passa i dati del Pokémon alla visualizzazione pokemon-detail.ejs
       res.render('pages/pokemon-detail', { pokemon: pokemonData });
   } catch (error) {
       console.error('Errore nel recupero dei dettagli del Pokémon:', error);
       res.status(500).send('Errore nel recupero dei dettagli del Pokémon');
   }
});


// Rotta per la ricerca dei Pokémon
app.post('/ricerca-pokemon', async (req, res) => {
   try {
       const { query } = req.body;
       // Effettua una richiesta GET al backend per ottenere i risultati della ricerca
       const response = await fetch(`http://localhost:8000/pokemon?query=${query}`);
       const data = await response.json();
       res.render('pages/risultati-ricerca', { pokemons: data });
   } catch (error) {
       console.error('Errore nella ricerca dei Pokémon:', error);
       res.status(500).send('Errore nella ricerca dei Pokémon');
   }
});


// Rotta per visualizzare la collezione e la lista dei desideri
app.get('/collezione', async (req, res) => {
   try {
     const response = await fetch('http://localhost:8000/api/collezione');
     const data = await response.json();
     res.render('pages/collezione', { collection: data.collection, wishlist: data.wishlist });
   } catch (error) {
     console.error('Errore nel recupero della collezione:', error);
     res.status(500).send('Errore nel recupero della collezione');
   }
});
 

// Rotta per rimuovere un Pokémon dalla collezione o dalla lista dei desideri
app.post('/rimuovi_da_collezione', async (req, res) => {
   try {
     const { pokemonId } = req.body; // req.body.pokemonId
     const response = await fetch('http://localhost:8000/api/rimuovi_da_collezione', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ pokemonId })
     });
     const data = await response.json();
     res.json(data);
   } catch (error) {
     console.error('Errore durante la rimozione del Pokémon dalla collezione:', error);
     res.status(500).send('Errore durante la rimozione del Pokémon dalla collezione');
   }
});
 

// Rotta per spostare un Pokémon tra la collezione e la lista dei desideri
app.post('/sposta_pokemon', async (req, res) => {
   try {
     const { pokemonId, isWishlist } = req.body;
     const response = await fetch('http://localhost:8000/api/sposta_pokemon', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ pokemonId, isWishlist })
     });
     const data = await response.json();
     res.json(data);
   } catch (error) {
     console.error('Errore durante lo spostamento del Pokémon:', error);
     res.status(500).send('Errore durante lo spostamento del Pokémon');
   }
});
 

// Avvia il server
app.listen(3000, () => {
  console.log('Front-end server in ascolto sulla porta 3000');
});