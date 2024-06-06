const WebSocket = require('ws')

function setupWebSocket(server){
    const wss = new WebSocket.Server({server})
    const rooms = {}
    
    wss.on('connection', ws=>{
        console.log('Usuário se conectou ao servidor.')

        ws.on('message', message=>{

            let parsedMessage

            try{
                parsedMessage = JSON.parse(message)
                
            } catch(err){
                ws.send('Aceitado apenas o modelo JSON, exemplo: {"action": "join", "room": "sala1"}')
                return
            }

            if(!parsedMessage["action"] || !parsedMessage["room"]){
                ws.send('Necessário colocar o (action) e a (room).')
                return
            }

            const {action, room, content } = parsedMessage

            if(action != 'join' && action != 'message'){
                ws.send('Aceita apenas duas ações: (join) ou (message)')
                return
            }

            if(action === 'join'){
                if(!rooms[room]){
                    rooms[room] = new Set()
                }
            
                rooms[room].add(ws)
                ws.room = room

                console.log(`Usuário entrou na sala ${ws.room}`)
                ws.send(`Você entrou na sala [${ws.room}]`)

                rooms[ws.room].forEach(client=>{
                    if(client != ws)
                    client.send('Outro usuário entrou na sala.')
                })

            }

            if(action === 'message'){
                if(!content){
                    ws.send('Necessário passar o content, exemplo: {"action": "message", "room": "sala1", "content":"test"}')
                    return
                }

                if(ws.room && rooms[ws.room]){
                    rooms[ws.room].forEach(client=>{
                        if(client != ws){
                            client.send(`Sala(${ws.room}) - Outro usário: ${content}`)
                        }
                    })

                }else{
                    ws.send('Usuário não possui nenhuma sala cadastrada ou esta sala não existe.')
                    return
                }
            }
        })

        ws.on('close', ()=>{
            if(ws.room && rooms[ws.room]){
                rooms[ws.room].delete(ws)
                console.log(`Usuário saiu da sala ${ws.room}`)
            }
            if(rooms[ws.room].size === 0){
                delete rooms[ws.room]
            }

            console.log('Usuário se desconectou.')
        })
    })

    console.log('Servidor WebSocket está pronto.')
}

module.exports = setupWebSocket