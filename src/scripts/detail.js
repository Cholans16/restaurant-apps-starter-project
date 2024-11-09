// Ambil ID restoran dari URL
const urlParams = new URLSearchParams(window.location.search);
const restaurantId = urlParams.get('id');

// Ambil elemen tempat detail restoran akan ditampilkan
const restaurantDetailElement = document.getElementById('restaurant-details');

// Custom Element untuk Form Review
class ReviewForm extends HTMLElement {
  constructor() {
    super();

    // Shadow DOM untuk Custom Element
    const shadow = this.attachShadow({ mode: 'open' });

    // Template form review
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        /* CSS untuk form review */
        /* Gunakan styling sesuai dengan kebutuhan desain Anda */
        form {
          margin-top: 20px;
        }
        label {
          display: block;
          margin-bottom: 8px;
        }
        input, textarea {
          width: 100%;
          padding: 8px;
          margin-bottom: 12px;
        }
        button {
          padding: 10px 20px;
          background-color: #007BFF;
          color: white;
          border: none;
          cursor: pointer;
        }
        .message {
          margin-top: 10px;
        }
      </style>
      <form id="review-form">
        <label for="name">Your Name:</label>
        <input type="text" id="name" name="name" required>
        <label for="review">Your Review:</label>
        <textarea id="review" name="review" rows="4" required></textarea>
        <button type="submit">Submit Review</button>
        <div class="message" id="message"></div>
      </form>
    `;
    shadow.appendChild(template.content.cloneNode(true));

    // Ambil elemen form dan pesan
    this.form = shadow.getElementById('review-form');
    this.message = shadow.getElementById('message');

    // Event listener untuk saat form disubmit
    this.form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = this.form.elements['name'].value;
      const review = this.form.elements['review'].value;

      // Kirim review ke API
      try {
        const response = await fetch('https://restaurant-api.dicoding.dev/review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': '12345' // Ganti dengan testing API key Anda
          },
          body: JSON.stringify({ id: restaurantId, name, review })
        });

        if (!response.ok) {
          throw new Error('Failed to submit review');
        }

        const data = await response.json();
        this.message.textContent = 'Review submitted successfully!';
        this.form.reset();
      } catch (error) {
        console.error('Error submitting review:', error);
        this.message.textContent = 'Failed to submit review. Please try again later.';
      }
    });
  }
}

// Daftarkan Custom Element ke dalam DOM
customElements.define('review-form', ReviewForm);

// Fungsi untuk mengambil detail restoran dari API berdasarkan ID
async function getRestaurantDetail(id) {
  try {
    // Tampilkan indikator loading
    restaurantDetailElement.innerHTML = '<p>Loading...</p>';

    const response = await fetch(`https://restaurant-api.dicoding.dev/detail/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const restaurant = data.restaurant;

    // Membuat elemen HTML untuk menampilkan detail restoran
    const detailHTML = `
      <h2>${restaurant.name}</h2>
      <img src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="${restaurant.name}">
      <p><strong>City:</strong> ${restaurant.city}</p>
      <p><strong>Address:</strong> ${restaurant.address}</p>
      <p><strong>Rating:</strong> ${restaurant.rating}</p>
      <p><strong>Description:</strong> ${restaurant.description}</p>
      <h3>Categories:</h3>
      <ul>
        ${restaurant.categories.map(category => `<li>${category.name}</li>`).join('')}
      </ul>
      <h3>Menu:</h3>
      <ul>
        <li><strong>Foods:</strong> ${restaurant.menus.foods.map(food => food.name).join(', ')}</li>
        <li><strong>Drinks:</strong> ${restaurant.menus.drinks.map(drink => drink.name).join(', ')}</li>
      </ul>
      <h3>Customer Reviews:</h3>
      <ul>
        ${restaurant.customerReviews.map(review => `
          <li>
            <strong>${review.name}</strong> (${review.date}): ${review.review}
          </li>
        `).join('')}
      </ul>
    `;

    // Menampilkan detail restoran pada halaman
    restaurantDetailElement.innerHTML = detailHTML;

    // Tambahkan Custom Element Review Form setelah detail restoran
    restaurantDetailElement.insertAdjacentHTML('beforeend', '<review-form></review-form>');
  } catch (error) {
    console.error('Error fetching restaurant detail:', error);
    restaurantDetailElement.innerHTML = '<p>Failed to load restaurant detail. Please try again later.</p>';
  }
}

// Panggil fungsi untuk mengambil detail restoran saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
  getRestaurantDetail(restaurantId);
});
