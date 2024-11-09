// favorites.js

// Membuat koneksi dengan IndexedDB
let db;

const request = indexedDB.open('resto-run-db', 1);

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

request.onsuccess = function(event) {
  console.log('Database connected successfully');
  db = event.target.result;

  // Panggil fungsi untuk menampilkan restoran favorit saat halaman dimuat
  displayFavoriteRestaurants();
};

request.onupgradeneeded = function(event) {
  // Jika database belum ada, maka kita akan membuat store untuk menyimpan restoran favorit
  const db = event.target.result;
  const objectStore = db.createObjectStore('favorites', { keyPath: 'id' });

  console.log('Database setup complete');
};

// Fungsi untuk menampilkan restoran favorit dari IndexedDB
function displayFavoriteRestaurants() {
  const transaction = db.transaction(['favorites'], 'readonly');
  const objectStore = transaction.objectStore('favorites');

  const favoriteRestaurantsElement = document.getElementById('favorite-restaurants');
  favoriteRestaurantsElement.innerHTML = ''; // Kosongkan isi sebelum menambahkan yang baru

  objectStore.openCursor().onsuccess = function(event) {
    const cursor = event.target.result;
    if (cursor) {
      // Ambil data restoran dari cursor.value
      const restaurant = cursor.value;

      // Buat elemen HTML untuk menampilkan restoran favorit
      const favoriteItem = document.createElement('div');
      favoriteItem.classList.add('favorite-item');

      // Tambahkan gambar restoran
      const image = document.createElement('img');
      image.src = `https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}`;
      image.alt = restaurant.name;
      favoriteItem.appendChild(image);

      // Tambahkan nama restoran
      const name = document.createElement('h2');
      name.textContent = restaurant.name;
      favoriteItem.appendChild(name);

      // Tambahkan kota atau rating (contoh: rating)
      const rating = document.createElement('div');
      rating.classList.add('rating');
      rating.textContent = `Rating: ${restaurant.rating}`;
      favoriteItem.appendChild(rating);

      // Tambahkan tautan detail restoran
      const detailLink = document.createElement('a');
      detailLink.href = `detail.html?id=${restaurant.id}`;
      detailLink.textContent = 'Detail';
      favoriteItem.appendChild(detailLink);

      // Tambahkan restoran ke dalam daftar restoran favorit
      favoriteRestaurantsElement.appendChild(favoriteItem);

      cursor.continue();
    } else {
      console.log('No more entries');
    }
  };
}
