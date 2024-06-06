import express from 'express';
import prisma from '../db/prisma.js';
import cors from 'cors';
import "dotenv/config";


const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware per analizzare i dati della richiesta POST
app.use(cors({ origin: "http://localhost:3000"}));



// Configura EJS come motore di visualizzazione
app.set('view engine', 'ejs');

// Servire file statici dalla cartella 'public'
app.use(express.static('public'));

  
// Rotta per ottenere i Pokémon in base alla query di ricerca
app.get('/pokemon', async (req, res) => {
  try {
    const { query } = req.query;
    let whereClause = {};
    if (query) {
      // Gestione della ricerca per numero nazionale
      const isNumber = !isNaN(query); // Verifica se la query è un numero
      if (isNumber) {
        whereClause.national_number = parseInt(query);
      } else {
        // Se la query non è un numero, cerca per nome inglese
        whereClause.english_name = { contains: query };
      }
    }
    // Esegui la ricerca
    const pokemons = await prisma.pokemon_data.findMany({
      where: whereClause
    });
    // Restituisci i risultati
    if (pokemons.length === 0) {
      return res.status(404).json({ error: 'Nessun Pokémon trovato' });
    }
    res.json(pokemons);
  } catch (error) {
    console.error('Errore nel recupero dei dati dei Pokémon:', error);
    res.status(500).json({ error: 'Errore nel recupero dei dati dei Pokémon' });
  }
});

// Rotta per la pagina dettagliata di un Pokémon
app.get('/pokemon/:id', async (req, res) => {
  try {
    // Recupera l'ID del Pokémon dalla richiesta
    const { id } = req.params;

    // Effettua la chiamata al database per recuperare i dettagli del Pokémon con quell'ID
    const pokemon = await prisma.pokemon_data.findUnique({
      where: { national_number: parseInt(id) }
    });

    // Verifica se il Pokémon è stato trovato
    if (!pokemon) {
      // Se il Pokémon non è stato trovato, restituisci uno stato 404
      return res.status(404).json({ error: 'Pokémon non trovato' });
    }

    // Se il Pokémon è stato trovato, restituisci i dettagli del Pokémon come JSON
    res.json(pokemon);
  } catch (error) {
    // Gestisci gli errori
    console.error('Errore nel recupero dei dettagli del Pokémon:', error);
    res.status(500).json({ error: 'Errore nel recupero dei dettagli del Pokémon' });
  }
});

// Rotta per la ricerca dei Pokémon
app.post('/ricerca-pokemon', async (req, res) => {
  try {
    const { query } = req.body;

    let whereClause = {};
    if (query) {
      whereClause.OR = [
        { national_number: parseInt(query) },
        { english_name: { contains: query } } // Utilizza contains per la ricerca parziale
      ];
    }

    console.log('Richiesta ricevuta per /ricerca-pokemon con la query:', query);
    const pokemons = await prisma.pokemon_data.findMany({
      where: whereClause
    });

    console.log('Pokémon ottenuti:', pokemons);
    if (pokemons.length === 0) {
      return res.status(404).json({ error: 'Nessun Pokémon trovato' });
    }

    res.json(pokemons);
  } catch (error) {
    console.error('Errore nella ricerca dei Pokémon:', error);
    res.status(500).json({ error: 'Errore nella ricerca dei Pokémon' });
  }
});


// Aggiungi un Pokémon alla collezione personale
app.post('/api/aggiungi_collezione', async (req, res) => {
  const { pokemonId } = req.body;
  try {
    // Controlla se il Pokémon è già nella collezione o nella lista dei desideri
    const existingEntry = await prisma.user_collection.findFirst({
      where: { national_number: pokemonId }
    });
    if (existingEntry) {
      return res.status(400).json({ success: false, error: 'Il Pokémon è già nella collezione o nella lista dei desideri' });
    }

    // Utilizziamo Prisma per creare una nuova riga nella tabella user_collection
    const userCollectionEntry = await prisma.user_collection.create({
      data: {
        national_number: pokemonId,
        is_wishlist: false // Il Pokémon è parte della collezione
      }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Errore durante l\'aggiunta del Pokémon alla collezione:', error);
    res.status(500).json({ success: false, error: 'Si è verificato un errore durante l\'aggiunta del Pokémon alla collezione.' });
  }
});


// Aggiungi un Pokémon alla lista dei desideri
app.post('/api/aggiungi_lista_desideri', async (req, res) => {
  const { pokemonId } = req.body;
  try {
    // Controlla se il Pokémon è già nella collezione o nella lista dei desideri
    const existingEntry = await prisma.user_collection.findFirst({
      where: { national_number: pokemonId }
    });
    if (existingEntry) {
      return res.status(400).json({ success: false, error: 'Il Pokémon è già nella collezione o nella lista dei desideri' });
    }

    // Utilizziamo Prisma per creare una nuova riga nella tabella user_collection
    const userWishlistEntry = await prisma.user_collection.create({
      data: {
        national_number: pokemonId,
        is_wishlist: true // Il Pokémon è parte della lista dei desideri
      }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Errore durante l\'aggiunta del Pokémon alla lista dei desideri:', error);
    res.status(500).json({ success: false, error: 'Si è verificato un errore durante l\'aggiunta del Pokémon alla lista dei desideri.' });
  }
});


// Rimuovi un Pokémon dalla collezione personale o dalla lista dei desideri
app.post('/api/rimuovi_da_collezione', async (req, res) => {
  const { pokemonId } = req.body;
  try {
    // Utilizziamo Prisma per rimuovere la riga dalla tabella user_collection
    const deleteEntry = await prisma.user_collection.deleteMany({
      where: { national_number: pokemonId }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Errore durante la rimozione del Pokémon dalla collezione:', error);
    res.status(500).json({ success: false, error: 'Si è verificato un errore durante la rimozione del Pokémon dalla collezione.' });
  }
});

// Sposta un Pokémon tra la collezione personale e la lista dei desideri
app.post('/api/sposta_pokemon', async (req, res) => {
  const { pokemonId, isWishlist } = req.body;
  try {
    // Utilizziamo Prisma per aggiornare la riga nella tabella user_collection
    const updateEntry = await prisma.user_collection.updateMany({
      where: { national_number: pokemonId },
      data: { is_wishlist: isWishlist }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Errore durante lo spostamento del Pokémon:', error);
    res.status(500).json({ success: false, error: 'Si è verificato un errore durante lo spostamento del Pokémon.' });
  }
});

// Visualizza la collezione personale e la lista dei desideri
app.get('/api/collezione', async (req, res) => {
  try {
    const collection = await prisma.user_collection.findMany({
      where: { is_wishlist: false },
      include: { pokemon: true }
    });
    const wishlist = await prisma.user_collection.findMany({
      where: { is_wishlist: true },
      include: { pokemon: true }
    });
    res.json({ collection, wishlist });
  } catch (error) {
    console.error('Errore nel recupero della collezione:', error);
    res.status(500).json({ error: 'Errore nel recupero della collezione' });
  }
});


// Rotta per ottenere solo i Pokémon della collezione
app.get('/api/collezione-pokemon', async (req, res) => {
  try {
    // Recupera solo i Pokémon della collezione dell'utente
    const collection = await prisma.user_collection.findMany({
      where: { is_wishlist: false }, // Filtra solo quelli che non sono nella lista dei desideri
      include: { pokemon: true }
    });

    // Invia i Pokémon della collezione come risposta
    res.json(collection);
  } catch (error) {
    console.error('Errore nel recupero dei Pokémon della collezione:', error);
    res.status(500).json({ error: 'Errore nel recupero dei Pokémon della collezione' });
  }
});


// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});

