/* Wealthy Health admin app: caches the app shell so it opens instantly and offline.
   Data calls (Supabase) are never cached or touched. */
var V='wh-admin-v2',SHELL=['admin.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  /* network first, fall back to cache, so updates arrive as soon as you are online */
  e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)});return res}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('admin.html')})}));
});
self.addEventListener('notificationclick',function(e){e.notification.close();e.waitUntil(self.clients.matchAll({type:'window'}).then(function(l){if(l.length)return l[0].focus();return self.clients.openWindow('admin.html')}))});

/* phone alerts: sent by the server even when the app is closed */
self.addEventListener('push',function(e){
  var d={};try{d=e.data?e.data.json():{}}catch(_){d={title:'Wealthy Health',body:e.data?e.data.text():''}}
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(l){
    var seen=l.some(function(c){return c.visibilityState==='visible'});
    l.forEach(function(c){c.postMessage({push:true})});
    if(seen)return; /* app is on screen: it refreshes itself, no banner needed */
    return self.registration.showNotification(d.title||'Wealthy Health',{body:d.body||'',icon:'icon-192.png',badge:'icon-192.png',tag:d.tag||'wh',renotify:true,data:{url:d.url||'admin.html'}});
  }));
});
