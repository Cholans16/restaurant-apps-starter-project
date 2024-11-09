// index.js

import '../styles/main.css';



const restoranList = document.querySelector('.restaurant-wrapper');
const drawerToggle = document.getElementById('drawer-toggle-label');
const drawer = document.getElementById('drawer');
const closeButton = document.getElementById('close-button');
const searchForm = document.querySelector('.search-form');

// Fungsi untuk mendapatkan daftar restoran dari API
async function getRestaurants() {
  try {
    const response = await fetch('https://restaurant-api.dicoding.dev/list');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const restaurants = data.restaurants;

    // Kosongkan daftar restoran sebelum menambahkan yang baru
    restoranList.innerHTML = '';

    // Menampilkan daftar restoran dalam elemen dengan class "restaurant-wrapper"
    restaurants.forEach(restaurant => {
      // Buat elemen div untuk setiap restoran
      const restoranItem = document.createElement('div');
      restoranItem.classList.add('restaurant');

      // Tambahkan gambar restoran
      const image = document.createElement('img');
      image.src = `https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}`;
      image.alt = restaurant.name;
      restoranItem.appendChild(image);

      // Tambahkan nama restoran
      const name = document.createElement('h2');
      name.textContent = restaurant.name;
      restoranItem.appendChild(name);

      // Tambahkan kota atau rating (contoh: rating)
      const rating = document.createElement('div');
      rating.classList.add('rating');
      rating.textContent = `Rating: ${restaurant.rating}`;
      restoranItem.appendChild(rating);

      // Tambahkan deskripsi restoran
      const description = document.createElement('p');
      description.textContent = restaurant.description;
      restoranItem.appendChild(description);

      // Tambahkan tautan detail restoran
      const detailLink = document.createElement('a');
      detailLink.href = `detail.html?id=${restaurant.id}`;
      detailLink.textContent = 'Detail';
      restoranItem.appendChild(detailLink);

      // Tambahkan restoran ke daftar
      restoranList.appendChild(restoranItem);
    });
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
  }
}

// Panggil fungsi getRestaurants saat halaman dimuat
window.addEventListener('DOMContentLoaded', getRestaurants);

// Event listener untuk toggle drawer navigasi saat hamburger button diklik
drawerToggle.addEventListener('click', function() {
  drawer.classList.toggle('open');
});

// Event listener untuk menutup drawer saat tombol close diklik
closeButton.addEventListener('click', function() {
  drawer.classList.remove('open');
});

// Event listener untuk menangani submit form pencarian
searchForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Menghentikan perilaku bawaan dari form submit

  // Ambil nilai input pencarian
  const searchInput = document.getElementById('search');
  const searchTerm = searchInput.value.trim().toLowerCase();

  // Ambil semua restoran
  const restaurants = document.querySelectorAll('.restaurant');

  // Iterasi melalui setiap restoran
  restaurants.forEach(restaurant => {
    // Ambil teks dari judul dan deskripsi restoran
    const name = restaurant.querySelector('h2').textContent.toLowerCase();
    const description = restaurant.querySelector('p').textContent.toLowerCase();

    // Periksa apakah kata kunci pencarian ada dalam judul atau deskripsi restoran
    if (name.includes(searchTerm) || description.includes(searchTerm)) {
      // Jika ada, tampilkan restoran
      restaurant.style.display = 'block';
    } else {
      // Jika tidak, sembunyikan restoran
      restaurant.style.display = 'none';
    }
  });

  // Hapus nilai input pencarian setelah pencarian dilakukan
  searchInput.value = '';
});

// index.js

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.2.1/workbox-sw.js');

if (workbox) {
  console.log(`Workbox berhasil dimuat`);

  // Caching strategi untuk halaman HTML
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'document',
    new workbox.strategies.NetworkFirst()
  );

  // Caching strategi untuk gambar
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

  // Caching strategi untuk data dari API
  workbox.routing.registerRoute(
    'https://restaurant-api.dicoding.dev/list',
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
    })
  );

  // Menambahkan event listener untuk menangani pengecualian
  self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() => {
          return caches.match('offline.html');
        })
      );
    }
  });

  // Menyimpan halaman offline
  workbox.precaching.precacheAndRoute([
    { url: 'offline.html', revision: null },
  ]);
} else {
  console.log(`Workbox gagal dimuat`);
}

