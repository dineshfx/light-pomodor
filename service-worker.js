
self.addEventListener("install",e=>{
    e.waitUntil(
      caches.open("static").then(cache=>{
        return cache.addAll(["./",'./images/logo192.png']);
      })
    );
  });
  
  // Fatch resources
  self.addEventListener("fetch",e=>{
    e.respondWith(
      caches.match(e.request).then(response=>{
        return response||fetch(e.request);
      })
    );
  });




self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());

    console.log('Ready!');
});





self.addEventListener('message', function (event) {
    if (event.data.key === 'showNotification') {
        self.registration.showNotification('Pomodoro Timer', {
            body: 'Your timer has finished from service worker!'
        });
    }
});


