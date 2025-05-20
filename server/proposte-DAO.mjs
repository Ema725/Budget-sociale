import { getBudget } from "./dati-DAO.mjs";
import { db } from "./db.mjs";
import {filtraProposte, Proposta} from "./Proposta.mjs"

export const getProposte = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM proposte', [], (err, rows) =>{
            if(err)
                reject(err);
            else{
                const elencoproposte = rows.map((p) => new Proposta(p.ID, p.text, p.budget,p.userID,p.rating));
                resolve(elencoproposte);
            }
        })
    })
}

export const getMiglioriProposte = () => {  
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM proposte', [], async (err, rows) =>{
            const bud = await getBudget();
            if(err)
                reject(err);
            else{
                const elencoproposte = rows.map((p) => new Proposta(p.ID, p.text, p.budget,p.userID,p.rating));
                const MiglioriProposte = filtraProposte(elencoproposte, bud);
                resolve(MiglioriProposte);
            }
        })
    })
}

export const getProposta = (pid) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM proposte WHERE id=?', [pid], (err, row) =>{
            if(err)
                reject(err)
            else
                resolve(new Proposta(row.ID, row.text, row.budget, row.userID, row.rating));
        })
    })
}

export const postProposta = (prop) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO proposte (text, budget, userID, rating) VALUES (?,?,?,?)', [prop.text, prop.budget, prop.userID, prop.rating], function(err){
            if(err)
                reject(err)
            else
                resolve(this.lastID)
        })
    })
}

export const deleteProposta = (propID) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM proposte WHERE ID=?', [propID], function(err){
            if(err)
                reject(err)
            else
                resolve("proposta eliminata correttamente")
        })
    })
}

export const deleteAllProposte = () => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM proposte', [], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
};

export const updateProposta = (prop) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM proposte WHERE ID=?', [prop.id], (err, row)=>{
            if(err)
                reject(err);
            else{
                db.run('UPDATE proposte SET text=?, budget=? WHERE ID=?', [prop.text, prop.budget, prop.id], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        if (this.changes === 0) {
                            reject(new Error('No rows updated'));
                        } else {
                            resolve('Proposta modificata');
                        }
                    }
                });
            }
        })       
    });
}


export const addVote = (id, voto) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE proposte SET rating = rating + ? WHERE ID = ?', [voto, id], function(err) {
            if (err)
                reject(err);
            else
                resolve("Voto aggiunto");
        });
    });
};

export const removeVote = (id, voto) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE proposte SET rating = rating - ? WHERE ID = ?', [voto, id], function(err) {
            if (err)
                reject(err);
            else
                resolve("Voto rimosso");
        });
    });
};