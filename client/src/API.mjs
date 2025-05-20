import { Proposta, Utente } from "./Proposta.mjs";

const SERVER_URL = 'http://localhost:3001';

// Fetch all proposte
export async function fetchProposte() {
    const response = await fetch(`${SERVER_URL}/api/proposte`);
    if (response.ok) {
        const proposte = await response.json();
        return proposte.map(p => new Proposta(p.id, p.text, p.budget, p.userID, p.rating));
    } else {
        throw new Error('Errore nel recupero delle proposte');
    }
}

// Fetch migliori proposte
export async function fetchMiglioriProposte() {
    const response = await fetch(`${SERVER_URL}/api/proposte/best`);
    if (response.ok) {
        const proposte = await response.json();
        return proposte.map(p => new Proposta(p.id, p.text, p.budget, p.userID, p.rating));
    } else {
        throw new Error('Errore nel recupero delle migliori proposte');
    }
}

// Add nuova proposta
export async function addProposta(proposta) {
    const response = await fetch(`${SERVER_URL}/api/proposte`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposta),
        credentials: 'include'
    });

    if (response.ok) {
        const { id } = await response.json();
        console.log("ID ritornato:", id); // Assicurati di visualizzare correttamente l'ID
        return id;
    } else {
        const error = await response.json();
        throw new Error(error.error);
    }
}

// Update proposta esistente
export async function updateProposta(proposta) {
    const response = await fetch(`${SERVER_URL}/api/proposte`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposta),
        credentials: 'include'
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
}

//aggiungi voto al rating
export async function addVote(id, voto) {
    const response = await fetch(`${SERVER_URL}/api/proposte/${id}/vote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, voto }),
        credentials: 'include'
    });

    if (response.ok) {
        const data = await response.json();
        return data.message;
    } else {
        const error = await response.json();
        throw new Error(error.error);
    }
}

//revoca voto dal rating
export async function removeVote(id, voto) {
    const response = await fetch(`${SERVER_URL}/api/proposte/${id}/revoke-vote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, voto }),
        credentials: 'include'
    });

    if (response.ok) {
        const data = await response.json();
        return data.message;
    } else {
        const error = await response.json();
        throw new Error(error.error);
    }
}

// Delete una proposta
export async function deleteProposta(id) {
    const response = await fetch(`${SERVER_URL}/api/proposte/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
}

//Delete tutte le proposte
export async function deleteAllProposte() {
    const response = await fetch(`${SERVER_URL}/api/proposte`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (response.ok) {
        const data = await response.json();
        return data.message;
    } else {
        const error = await response.json();
        throw new Error(error.error);
    }
}

// Imposta la fase
export async function aggiornaFase(fase) {
    const response = await fetch(`${SERVER_URL}/api/fase`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fase }),
        credentials: 'include'
    });

    if (response.ok) {
        const data = await response.json();
        return data.changes;
    } else {
        const error = await response.json();
        throw new Error(error.error);
    }
}

// Imposta il budget
export async function aggiornaBudget(budget) {
    const response = await fetch(`${SERVER_URL}/api/budget`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget }),
        credentials: 'include'
    });

    if (response.ok) {
        const data = await response.json();
        return data.changes;
    } else {
        const error = await response.json();
        throw new Error(error.error);
    }
}

// Ottieni il budget
export async function getBudget() {
    const response = await fetch(`${SERVER_URL}/api/budget`);

    if (response.ok) {
        const data = await response.json();
        return data.budget;
    } else {
        const error = await response.json();
        throw new Error(error.error);
    }
}

// Ottieni la fase
export async function getFase() {
    const response = await fetch(`${SERVER_URL}/api/fase`);

    if (response.ok) {
        const data = await response.json();
        return data.fase;
    } else {
        const error = await response.json();
        throw new Error(error.error);
    }
}

//ottieni tutti i voti
export async function fetchVoti() {
    const response = await fetch(`${SERVER_URL}/api/voti`);
    if (response.ok) {
        const voti = await response.json();
        return voti;
    } else {
        throw new Error('Failed to fetch voti');
    }
}

//aggiunta di un voto
export async function addVoto(voto) {
    console.log(voto);
    const response = await fetch(`${SERVER_URL}/api/voti`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voto),
        credentials: 'include'
    });
    if (response.ok) {
        const message = await response.json();
        return message;
    } else {
        const error = await response.json();
        throw new Error(error.error);
    }
}

// Funzione per eliminare un voto
export async function removeVoto(voto) {
    const response = await fetch(`${SERVER_URL}/api/voti`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voto),
        credentials: 'include'
    });
    if (response.ok) {
        const message = await response.json();
        return message;
    } else {
        const error = await response.json();
        throw new Error(error.error);
    }
}

// Funzione per eliminare tutti i voti
export async function deleteAllVoti() {
    const response = await fetch(`${SERVER_URL}/api/voti/all`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) {
        const message = await response.json();
        return message;
    } else {
        const error = await response.json();
        throw new Error(error.error);
    }
}

//login
export async function logIn(credentials) {
    const response = await fetch(SERVER_URL + '/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
};

//user
export async function getUserInfo() {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw Error("No previous session available"); 
    }
};

//All users
export async function fetchAllUsers() {
    const response = await fetch(`${SERVER_URL}/api/utenti`);
    if (response.ok) {
        const utenti = await response.json();
        return utenti;
    } else {
        throw new Error('Failed to fetch users');
    }
}

//logout
export async function logOut (){
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok)
      return null;
}