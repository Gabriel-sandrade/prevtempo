// service-worker.js

const CACHE_NAME = 'weather-app-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/scripts.js',
    'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;1,300&display=swap',
    'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,500;1,500&display=swap',
    'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,700;1,700&display=swap',
    'https://www.svgrepo.com/show/488200/find.svg',
    'https://openweathermap.org/img/wn/04n.png',
    'confira-a-previsao-do-tempo-para-este-final-de-semana-em-divinopolis-1-696x490.jpg',
    '552448.png'
];

self.addEventListener('install', event => {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request to use it once to fetch from the server and once to cache it
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response to use it once to return to the requester and once to cache it
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
    );
});
