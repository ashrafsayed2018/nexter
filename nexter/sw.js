const staticCacheName = "static-site-v4";
const daynamicCacheName   = "site-daynamic-v1";
const assets = [
    '/',
    '/index.html',
    '/fallback.html',
    '/app.js',
    '/manifest.json',
    '/css/style.css',
    '/img/apple/512.png',
    '/img/appstore.png',
    '/img/client-1.jpeg',
    'img/client-2.jpg',
    'img/client-3.jpg',
    'img/gal-1.jpg',
    'img/gal-2.jpg',
    'img/gal-3.png',
    'img/gal-4.jpg',
    'img/gal-5.jpg',
    'img/gal-6.jpg',
    'img/gal-7.png',
    'img/gal-8.png',
    'img/gal-9.jpg',
    'img/gal-10.jpg',
    'img/gal-11.jpg',
    'img/gal-12.png',
    'img/gal-13.jpg',
    'img/gal-14.jpg',
    "/img/playstore.png",
    "img/service_ads_create.png",
    '/img/service_google.png',
    '/img/service_instagram.jpg',
    '/img/service_snapchat.jpg',
    '/img/service_website.jpg',
    '/img/service_whatsapp.jpg',
    '/img/story_1.png',
    '/img/story_2.jpg',
    '/img/story_back.jpg'



]

// function to limit the size daynamic cache 

const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name,size))
            }
            //  while(keys.length > size) { cache.delete(keys[0]) }
        })
    })
}

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
    // delete the old cache version
    event.waitUntil(
        caches.keys().then(keys => {
            // console.log(keys) 
     
            return Promise.all(keys.filter(key => key != staticCacheName &&  key != daynamicCacheName)
            .map(key => caches.delete(key))
            )
    
        })
    )
});


// fetch event

self.addEventListener('fetch', event => {

 // check if request is made by chrome extensions or web page
  // if request is made for web page url must contains http.
  if (!(event.request.url.indexOf('http') === 0)) return; // skip the request. if request is not made with http protocol


    event.respondWith(
        caches.match(event.request)
        .then(cacheRes => {
          return  cacheRes || fetch(event.request).then(fetchRes => {

              // dsynamic cache the pages which the user visit 

              return caches.open(daynamicCacheName).then(cache => {
                 cache.put(event.request.url,fetchRes.clone());
                 limitCacheSize(daynamicCacheName,75)
                 return fetchRes;
              });  
          });
        }).catch(() => {
            if(event.request.url.includes('.html')) {
                
               return caches.match('/fallback.html')
            }
        })
    );
})
