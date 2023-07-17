import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import * as Notiflix from 'notiflix';

const formEl = document.getElementById('search-form');

const loadBtn = document.querySelector('.load-more');

const galleryEl = document.querySelector('.gallery');

let currentPage = 1;
let lightbox = null;
let currentQuery = '';


async function searchImages(query, page = 1, perPage = 40) {
  const Key = '38308100-c8bfe7ecfd47e0eeb8c400dc4';
  const Url = `https://pixabay.com/api/?key=${Key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  try {
    const response = await axios.get(Url);
    const { data } = response;
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      if (page === 1) {
        resetGallery();
        hideLoadBtn();
        lightbox = new SimpleLightbox('.gallery a');
      }
      renderImages(data.hits);
      const totalHits = data.totalHits || 0;
      if (page * perPage < totalHits) {
        showLoadBtn();
      } else {
        hideLoadBtn();
      }
    }
  } catch (error) {
    console.log('Error:', error);
  }
}

formEl.addEventListener('submit', event => {
    event.preventDefault();
    const searchQuery = event.target.elements.searchQuery.value.trim();
    if (searchQuery !== '') {
      currentPage = 1;
      currentQuery = searchQuery;
      searchImages(searchQuery, currentPage);
      hideLoadBtn();
    }
  });
  loadBtn.addEventListener('click', () => {
    currentPage += 1;
    searchImages(currentQuery, currentPage);
  });


  
function renderImages(images) {
  const galleryFragment = document.createDocumentFragment();
  images.forEach(image => {
    const Card = creatCardMarkup(image);
    galleryFragment.appendChild(Card);
  });
  galleryEl.appendChild(galleryFragment);
  lightbox.refresh();
}
function creatCardMarkup(image) {
  const Card = document.createElement('div');
  Card.classList.add('photo-card');
  const linkElement = document.createElement('a');
  linkElement.href = image.largeImageURL;
  const imageElement = document.createElement('img');
  imageElement.src = image.webformatURL;
  imageElement.alt = image.tags;
  imageElement.loading = 'lazy';
  const infoContainer = document.createElement('div');
  infoContainer.classList.add('info');
  const likes = createInfoItem('Likes', image.likes);
  const views = createInfoItem('Views', image.views);
  const comments = createInfoItem('Comments', image.comments);
  const downloads = createInfoItem('Downloads', image.downloads);
  infoContainer.appendChild(likes);
  infoContainer.appendChild(views);
  infoContainer.appendChild(comments);
  infoContainer.appendChild(downloads);
  linkElement.appendChild(imageElement);
  Card.appendChild(linkElement);
  Card.appendChild(infoContainer);
  return Card;
}
function createInfoItem(label, value) {
  const infoItem = document.createElement('p');
  infoItem.classList.add('info-item');
  infoItem.innerHTML = `<b>${label}:</b> ${value}`;
  return infoItem;
}
function resetGallery() {
  galleryEl.innerHTML = '';
}
function showLoadBtn() {
  loadBtn.style.display = 'block';
}
function hideLoadBtn() {
  loadBtn.style.display = 'none';
}
