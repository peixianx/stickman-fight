const express=require('express');const http=require('http');const {Server}=require('socket.io');
const app=express(),server=http.createServer(app),io=new Server(server);app.use(express.static('public'));
const rooms=new Map();const code=()=>Math.random().toString(36).slice(2,7).toUpperCase();
const roster=c=>(rooms.get(c)||[]).map((id,i)=>({id,player:i+1}));
function sendRoster(c){io.to(c).emit('roster',roster(c));}
io.on('connection',s=>{
 s.on('create',cb=>{let c;do c=code();while(rooms.has(c));rooms.set(c,[s.id]);s.join(c);s.data.room=c;s.data.player=1;cb({ok:true,code:c,player:1});sendRoster(c);});
 s.on('join',(raw,cb)=>{let c=(raw||'').trim().toUpperCase(),r=rooms.get(c);if(!r||r.length>=4)return cb({ok:false,reason:!r?'notfound':'full'});r.push(s.id);s.join(c);s.data.room=c;s.data.player=r.length;cb({ok:true,code:c,player:r.length});sendRoster(c);io.to(c).emit('ready',{count:r.length});});
 s.on('state',d=>{if(s.data.room)s.to(s.data.room).emit('state',{...d,player:s.data.player});});
 s.on('hit',d=>{if(s.data.room)io.to(s.data.room).emit('hit',{...d,attacker:s.data.player});});
 s.on('weapon',d=>{if(s.data.room)s.to(s.data.room).emit('weapon',{player:s.data.player,weapon:d.weapon});});
 s.on('restart',()=>{if(s.data.room)io.to(s.data.room).emit('restart');});
 s.on('disconnect',()=>{let c=s.data.room,r=rooms.get(c);if(!r)return;r=r.filter(id=>id!==s.id);if(!r.length){rooms.delete(c);return;}rooms.set(c,r);r.forEach((id,i)=>{let q=io.sockets.sockets.get(id);if(q)q.data.player=i+1;});sendRoster(c);io.to(c).emit('playerLeft',{count:r.length});});
});server.listen(process.env.PORT||3000,()=>console.log('Stickman Online 4-player running'));
