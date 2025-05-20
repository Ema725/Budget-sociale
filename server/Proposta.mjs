export function Proposta(id, text, budget, userID, rating=0){
    this.id = id;
    this.text = text;
    this.budget = budget;
    this.userID = userID;
    this.rating = rating;
}

export function filtraProposte(elenco, budgetTOT){
    let miglioriProposte = [];
    const proposteSorted = elenco.sort((a,b) => b.rating - a.rating);
    let bud = 0;
    let i = 0;
    while(bud < budgetTOT && i < proposteSorted.length){
        if(proposteSorted[i].budget + bud < budgetTOT){
            miglioriProposte.push(proposteSorted[i]);
        }
        bud = bud + proposteSorted[i].budget;
        i = i + 1;
    }
    return miglioriProposte;
}

export function Voto(propostaid, userid, voto){
    this.propostaid = propostaid;
    this.userid = userid;
    this.voto = voto;
}

export function Utente(id, username){
    this.id = id;
    this.username = username;
}