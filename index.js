import expressWs from "express-ws"
import express from "express"

const port = 8089
const wsInstance = expressWs(express())
let SemuaUser = {}

wsInstance.app.ws("/ws", function layananchat(ws){
    
    let UserID = ''

    ws.send(`[SERVER] Masukkan User ID`)
    ws.on('message', pesan =>{
        console.log('message',UserID, pesan)
        if(UserID===''){
            const tempUserID = pesan.trim().toLowerCase()
            if(tempUserID==='server' || typeof SemuaUser['tempUserID']!=='undefined'){
                ws.send(`[SERVER] Mohon Gunakan User ID selain ${tempUserID}`)
            } else {
                UserID = tempUserID
                SemuaUser={...SemuaUser, [UserID]: ws}
                ws.send(`[SERVER] Selamat Datang ${UserID}, sekarang anda sudah bisa menggunakan layanan ini`)
            }
        } else {
            for(const u in SemuaUser){
                if(u === UserID) continue
                SemuaUser[u].send(`[${UserID}]${pesan}`)
            }
        }
    })

    ws.on('close', (code, reason) => {
        console.log('close',code, reason)
        if(SemuaUser[UserID]!=='undefined') delete(SemuaUser[UserID])
    })
}) 