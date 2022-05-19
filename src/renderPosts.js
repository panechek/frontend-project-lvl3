export default (posts, i18nInstance) => {
  const cardPosts = document.createElement('div');
  cardPosts.classList.add('card', 'border-0');

  const cardPostsBody = document.createElement('div');
  cardPostsBody.classList.add('card-body');
  cardPosts.append(cardPostsBody);

  const cardPostsTitle = document.createElement('h2');
  cardPostsTitle.classList.add('card-title', 'h4');
  cardPostsTitle.textContent = 'Посты';
  cardPostsBody.append(cardPostsTitle);

  const ulPosts = document.createElement('ul');
  ulPosts.classList.add('list-group', 'border-0', 'rounded-0');
  posts.forEach((item) => {
    const liPost = document.createElement('li');
    liPost.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const titlePost = document.createElement('a');
    if (item.viewed) {
      titlePost.classList.remove('fw-bold');
      titlePost.classList.add('fw-normal', 'link-secondary');
    } else {
      titlePost.classList.add('fw-bold');
    }

    titlePost.setAttribute('href', item.link);
    titlePost.setAttribute('data-id', item.id);
    titlePost.setAttribute('target', '_blank');
    titlePost.setAttribute('rel', 'noopener noreferrer');

    titlePost.textContent = item.title;
    liPost.append(titlePost);
    const buttonPost = document.createElement('button');

    buttonPost.textContent = i18nInstance.t('toSee');
    buttonPost.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonPost.setAttribute('type', 'button');
    buttonPost.setAttribute('data-id', item.id);
    buttonPost.setAttribute('data-bs-toggle', 'modal');
    buttonPost.setAttribute('data-bs-target', '#modal');
    liPost.append(buttonPost);
    ulPosts.append(liPost);
  });
  cardPostsBody.append(ulPosts);
  return cardPosts;
};
