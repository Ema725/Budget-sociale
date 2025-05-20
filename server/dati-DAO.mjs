import { db } from "./db.mjs";

export const setFase = (fase) =>{
    return new Promise((resolve, reject)=> {
        db.run('UPDATE dati SET fase=?', [fase], function(err){
            if(err)
                reject(err)
            else
                resolve(this.changes)
        })
    })
}

export const setBudget = (budget) =>{
    return new Promise((resolve, reject)=> {
        db.run('UPDATE dati SET budget=?', [budget], function(err){
            if(err)
                reject(err)
            else
                resolve(this.changes)
        })
    })
}

export const getBudget = () =>{
    return new Promise((resolve, reject)=> {
        db.get("SELECT * FROM dati", [], (err, row)=>{
            if(err)
                reject(err)
            else
                resolve(row.budget)
        })
    })
}

export const getFase = () =>{
    return new Promise((resolve, reject)=> {
        db.get("SELECT * FROM dati", [], (err, row)=>{
            if(err)
                reject(err)
            else
                resolve(row.fase)
        })
    })
}