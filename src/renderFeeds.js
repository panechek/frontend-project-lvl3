export default (feeds) => {
  const cardFeeds = document.createElement('div');
  cardFeeds.classList.add('card', 'border-0');

  const cardBodyFeeds = document.createElement('div');
  cardBodyFeeds.classList.add('card-body');
  cardFeeds.append(cardBodyFeeds);

  const cardTitleFeeds = document.createElement('h2');
  cardTitleFeeds.classList.add('card-title', 'h4');
  cardTitleFeeds.textContent = 'Фиды';
  cardBodyFeeds.append(cardTitleFeeds);

  const ulFeeds = document.createElement('ul');
  ulFeeds.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach(({ title, description }) => {
    const liFeed = document.createElement('li');
    liFeed.classList.add('list-group-item', 'border-0', 'border-end-0');
    const titleFeed = document.createElement('h3');
    titleFeed.classList.add('h6', 'm-0');
    titleFeed.textContent = title;
    liFeed.append(titleFeed);
    const descriptionFeed = document.createElement('p');
    descriptionFeed.classList.add('m-0', 'small', 'text-black-50');
    descriptionFeed.textContent = description;
    liFeed.append(descriptionFeed);
    ulFeeds.append(liFeed);
  });
  cardFeeds.append(ulFeeds);
  return cardFeeds;
};
