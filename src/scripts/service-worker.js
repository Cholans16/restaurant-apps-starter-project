// service-worker.js

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.2.2/workbox-sw.js');

workbox.setConfig({ debug: true });

workbox.routing.registerRoute(
  'https://restaurant-api.dicoding.dev/list',
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

workbox.routing.setDefaultHandler(new workbox.strategies.NetworkFirst());

workbox.precaching.precacheAndRoute([
  { url: '/index.html', revision: null },
  { url: '/offline.html', revision: null },
  // tambahkan asset lain yang ingin di-cache di sini
]);

// Tambahkan event listener untuk menangani fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Custom logic for handling specific requests
  // For example, handling dynamic content based on request.path
});
