import _ from 'lodash';

export default (renderField, state, i18nInstance, elements) => {
  if (renderField === 'feedback') {
    if (state.error === 'sucsess') {
      elements.feedbackSearch.textContent = i18nInstance.t('sucsess');
      elements.inputSearchForm.classList.remove('is-invalid');
      elements.feedbackSearch.classList.remove('text-danger');
      elements.feedbackSearch.classList.add('text-success');
    } else {
      elements.feedbackSearch.textContent = i18nInstance.t(`${state.error}`);
      elements.inputSearchForm.classList.add('is-invalid');
      elements.feedbackSearch.classList.add('text-danger');
      elements.feedbackSearch.classList.remove('text-success');
    }
  } else if (renderField === 'feed') {
    elements.feed.innerHTML = '';

    elements.modal.setAttribute('wfd-invisible', 'true');
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
    state.feeds.forEach(({ title, description }) => {
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
    elements.feed.append(cardFeeds);
  } else if (renderField === 'post') {
    elements.posts.innerHTML = '';

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
    _.sortBy(state.posts, 'time').reverse().forEach((item) => {
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
    elements.posts.append(cardPosts);
  }
};
