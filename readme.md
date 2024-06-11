# Pokedex Manager

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

## Descrizione

Pokedex Manager è un'applicazione web che permette agli utenti di esplorare e gestire un database di Pokémon. Gli utenti possono visualizzare informazioni dettagliate su ciascun Pokémon, come statistiche, evoluzioni e tipi, e gestire una collezione personale.

## Indice

- [Struttura del Progetto](#struttura-del-progetto)
- [Installazione](#installazione)
- [Utilizzo](#utilizzo)
- [Licenza](#licenza)
- [Contatti](#contatti)
- [Screenshots](#screenshots)

## Struttura del Progetto

La repository è organizzata nelle seguenti cartelle:

- `pokedex_manager`: Contiene il codice front-end (HTML, CSS, JavaScript).
- `backend`: Contiene il codice back-end (Express.js).
- `database`: Contiene i file per la configurazione e il caricamento del database MySQL.

## Installazione

### Prerequisiti

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [npm](https://www.npmjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)

### Istruzioni
```
1. Clona il repository:
git clone https://github.com/tuo-utente/pokedex-manager.git
```
```
2. Entra nella directory del progetto:
cd pokedex-manager
```
```
3. Configura il database MySQL:
Crea un database in MySQL.
```
```
4. Carica il dump del database fornito nel file database/pokemon_data.sql:
- mysql -u tuo-utente -p nome-del-database < database/pokemon_data.sql
```
### Installazione Back-end
```
1. Entra nella directory del back-end:
cd backend
```
```
2. Installa le dipendenze:
npm install
```
```
3. Configura le variabili d'ambiente nel file .env:
PORT=8000
DATABASE_URL="mysql://nomeutente:password@localhost:3306/pokedex?schema=public"
JWT_SECRET="tua-chiave-segreta"
```
```
4. Inizializza Prisma:
npx prisma generate
```
```
5. Avvia il server "back-end" in modalità sviluppo:
npm run dev
```
### Installazione Front-end
```
1. Entra nella directory del front-end:
cd ../pokedex_manager
```
```   
2. Installa le dipendenze:
npm install
```
```   
3. Installa Tailwind CSS:
npm install -D tailwindcss
npx tailwindcss init
```
```
4. Configura Tailwind CSS aggiungendo il percorso dei file content nel file tailwind.config.js:
module.exports = {
  content: ["./src/**/*.{html,js,ejs}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
```
5. Avvia Tailwind CSS:
npm run tw
```
```
6. Avvia il server "front-end" in modalità sviluppo:
npm run dev
```
### Utilizzo
```
1. Visualizzare Pokémon:
   Vai alla pagina "pokemon" per vedere l'elenco di Pokémon.

2. Clicca su un Pokémon per visualizzare i dettagli, incluse statistiche, abilità, tipi e immagini.

3. Ricerca e Filtraggio

4. Usa la barra di ricerca per trovare Pokémon per numero nazione o il suo nome.

5. Applica filtri per tipo.

6. Gestione Collezione:
- Aggiungi Pokémon alla tua collezione personale.
- Rimuovi Pokémon dalla tua collezione.
- Tieni traccia dei Pokémon che possiedi o desideri.
```

### Screenshots

#### Homepage
![Homepage](screenshots/homepage.png)

#### Lista Pokémon
![Lista Pokémon](screenshots/lista_pokémon.png)

#### Dettagli Pokémon
![Dettagli Pokémon](screenshots/dettagli_pokémon.png)

#### Ricerca
![Ricerca](screenshots/ricerca.png)

#### Gestione Collezione
![Gestione Collezione](screenshots/collezione.png)


### Licenza
```
Questo progetto è licenziato sotto la licenza MIT - vedi il file LICENSE per i dettagli.
```
### Contatti
```
Per qualsiasi domanda, contattami a: michele.caniglia5@gmail.com
```
