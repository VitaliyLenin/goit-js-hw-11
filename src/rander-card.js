export function randerCard(data) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = data;

  return `<div class="card">
    <a class="gallery-item" href='${largeImageURL}'>
    <img class=' gallery-image' src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a> 
        <div class="info">
            <p class="info-item">
                <b>Likes</b>
                <span>${likes}</span>
            </p>
            <p class="info-item">
                <b>Views</b>
                <span>${views}</span>
            </p>
            <p class="info-item">
                <b>Comments</b>
                <span>${comments}</span>
            </p>
            <p class="info-item">
                <b>Downloads</b>
                <span>${downloads}</span>
            </p>
        </div>
    </div>`;
}
