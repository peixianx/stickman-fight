const express=require('express');const http=require('http');const {Server}=require('socket.io');
const app=express(),server=http.createServer(app),io=new Server(server);app.use(express.static('public'));
const rooms=new Map(); const code=()=>Math.random().toString(36).slice(2,7).toUpperCase();
io.on('connection',s=>{
 s.on('create',cb=>{let c;do c=code();while(rooms.has(c));rooms.set(c,[s.id]);s.join(c);s.data.room=c;s.data.player=1;cb({ok:true,code:c,player:1});});
 s.on('join',(c,cb)=>{c=(c||'').toUpperCase();let r=rooms.get(c);if(!r||r.length>=2)return cb({ok:false});r.push(s.id);s.join(c);s.data.room=c;s.data.player=2;cb({ok:true,code:c,player:2});io.to(c).emit('ready');});
 s.on('state',d=>{if(s.data.room)s.to(s.data.room).emit('state',{...d,player:s.data.player});});
 s.on('hit',d=>{if(s.data.room)s.to(s.data.room).emit('hit',d);});
 s.on('weapon',d=>{if(s.data.room)s.to(s.data.room).emit('weapon',d);});
 s.on('restart',()=>{if(s.data.room)io.to(s.data.room).emit('restart');});
 s.on('disconnect',()=>{let c=s.data.room,r=rooms.get(c);if(!r)return;r=r.filter(id=>id!==s.id);if(r.length)rooms.set(c,r);else rooms.delete(c);io.to(c).emit('left');});
});server.listen(process.env.PORT||3000,()=>console.log('Stickman Online running'));
