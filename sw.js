const staticCacheName = "static-site";
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons'

]

// install the service worker 
 
self.addEventListener('install' , event => {
    //  console.log(event)

    event.waitUntil(

        caches.open(staticCacheName)
        .then(cache => {
            console.log('caching shell asset ')
            cache.addAll(assets)
        })
    );
    


});


// activate event 

self.addEventListener('activate' , event => {
    // console.log(event)
});


// fetch event

self.addEventListener('fetch', event => {
    // console.log('fetch event' , event)

    event.respondWith(
        caches.match(event.request)
        .then(cacheRes => {
          return  cacheRes || fetch(event.request)
        })
    )
})