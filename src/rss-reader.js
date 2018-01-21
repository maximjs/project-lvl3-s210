import axios from 'axios';
import isURL from 'validator/lib/isURL';
import url from 'url';

const state = {
  input: '',
  isValidInput: null,
  dataFeed: [],
};

const container = document.querySelector('.container');
const divJumb = document.querySelector('.jumbotron');

const getDataFeed = channelArr =>
  channelArr.map((item) => {
    const itemTitle = item.querySelector('title');
    const itemLink = item.querySelector('link').nextSibling;
    const itemDescription = item.querySelector('description');
    const title = itemTitle ? itemTitle.textContent : 'No title';
    const link = itemLink ? itemLink.textContent.trim() : 'No link';
    const description = itemDescription ? itemDescription.textContent : 'No description';
    return { title, link, description };
  });

const findItem = href =>
  state.dataFeed.reduce((acc, feed) => {
    const item = feed.data.find(el => el.link === href);
    if (!item) {
      return acc;
    }
    return item;
  }, {});

const handlerInput = input => () => {
  state.input = String(input.value);
  state.isValidInput = isURL(state.input);
  if (!state.input) {
    input.classList.remove('is-valid', 'is-invalid');
  } else if (state.isValidInput) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
  }
};

const createFeedsTable = () => {
  const table = document.createElement('table');
  table.className = 'table-bordered';
  table.id = 'feedsTable';
  const divTable = document.createElement('div');
  divTable.className = 'my-3';
  divTable.appendChild(table);
  divJumb.appendChild(divTable);
};

const handlerATag = (event) => {
  event.preventDefault();
  const { href } = event.target;
  const dataItem = findItem(href);
  const { description } = dataItem;
  const modal = divJumb.querySelector('#modalItem');
  const h5 = modal.querySelector('h5');
  h5.innerHTML = description;
  const aModalTag = modal.querySelector('a');
  aModalTag.href = href;
  aModalTag.textContent = href;
};

const createItemsTable = () => {
  const itemsTable = document.createElement('table');
  itemsTable.className = 'ml-3 table-striped';
  itemsTable.id = 'itemsTable';
  container.appendChild(itemsTable);
  return itemsTable;
};

const displayItemsTable = (dataFeed) => {
  const itemsTable = createItemsTable();
  dataFeed.forEach((item) => {
    const { title, link } = item;
    const aTag = document.createElement('a');
    aTag.addEventListener('click', handlerATag);
    aTag.setAttribute('data-toggle', 'modal');
    aTag.setAttribute('data-target', '#modalItem');
    aTag.textContent = title;
    aTag.href = link;
    const itemRow = itemsTable.insertRow();
    const itemCell = itemRow.insertCell();
    itemCell.appendChild(aTag);
  });
};

const getDescription = descrNode => (descrNode.childNodes.length === 1 ? descrNode.innerHTML : 'No description');

const getFeedsData = () => {
  const dataPromiseArr = state.dataFeed.map(el => axios.get(`/api/rss?url=${el.feed.link}`));
  return Promise.all(dataPromiseArr);
};

const handlerForm = input => (event) => {
  event.preventDefault();
  const inputForm = input;
  inputForm.classList.remove('is-valid', 'is-invalid');
  inputForm.value = '';
  if (!document.querySelector('#feedsTable')) {
    createFeedsTable();
  }
  axios.get(`/api/rss?url=${state.input}`)
    .then((resp) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(resp.data, 'text/html');
      return doc;
    })
    .then((doc) => {
      const channel = doc.querySelector('channel');
      console.log(channel);
      if (!channel) {
        throw new Error('This is not the rss feed');
      }
      const feedObj = {
        feed: {
          title: '',
          link: '',
          description: '',
        },
        data: [],
      };
      feedObj.feed.link = state.input;
      const titleFeed = channel.querySelector('title');
      feedObj.feed.title = titleFeed.innerHTML;
      const descrFeed = channel.querySelector('description');
      feedObj.feed.description = getDescription(descrFeed);
      const table = document.querySelector('#feedsTable');
      const row = table.insertRow();
      const cellTitle = row.insertCell();
      cellTitle.className = 'p-1';
      cellTitle.innerHTML = titleFeed.innerHTML;
      const cellDescr = row.insertCell();
      cellDescr.className = 'p-1';
      cellDescr.innerHTML = getDescription(descrFeed);
      const channelArr = [...channel.querySelectorAll('item')];
      const dataFeed = getDataFeed(channelArr);
      feedObj.data = dataFeed;
      state.dataFeed = [...state.dataFeed, feedObj];
      displayItemsTable(dataFeed);
      container.appendChild(document.createElement('hr'));
      state.input = '';
      state.isValidInput = null;
    })
    .catch(error => console.error(new Error(`${state.input} ${error.message}`)));
};

const handlerNavbar = (aTag, input) => (event) => {
  event.preventDefault();
  const inputForm = input;
  inputForm.value = aTag.href;
  state.input = inputForm.value;
};

const getDiffDataFeed = newDataFeed => state.dataFeed.map((elem, index) => {
  const diff = newDataFeed[index].filter((elemNew) => {
    const findIndex = elem.data.findIndex(elemOld => elemNew.link === elemOld.link);
    return findIndex === -1;
  });
  return { ...elem, data: diff };
});

const updateDataFeed = diffDataFeed => state.dataFeed.forEach((el, index) => {
  const feedEl = el;
  feedEl.data = [...diffDataFeed[index].data, ...feedEl.data];
});

const getHost = (link) => {
  const urlObj = url.parse(link);
  if (!urlObj.host) {
    return '';
  }
  const hostArr = urlObj.host.split('.');
  if (hostArr.length === 3) {
    return hostArr.slice(1).join('.');
  }
  return hostArr.join('.');
};

const rssReader = () => {
  const form = document.querySelector('#rss-form');
  const input = form.querySelector('input');
  input.addEventListener('keyup', handlerInput(input));
  form.addEventListener('submit', handlerForm(input));
  const navbar = document.querySelector('.navbar');
  const liArr = [...navbar.querySelectorAll('li')];
  liArr.forEach((li) => {
    const aTag = li.querySelector('a');
    aTag.addEventListener('click', handlerNavbar(aTag, input));
  });

  setInterval(() => {
    if (state.dataFeed.length !== 0) {
      getFeedsData()
        .then(resp => resp.map((el) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(el.data, 'text/html');
          return doc;
        }))
        .then((data) => {
          const newDataFeed = data.map((feed) => {
            const channel = feed.querySelector('channel');
            const channelArr = [...channel.querySelectorAll('item')];
            return getDataFeed(channelArr);
          });
          const diffDataFeed = getDiffDataFeed(newDataFeed);
          updateDataFeed(diffDataFeed);
          diffDataFeed.forEach((feedsEl) => {
            if (feedsEl.data.length !== 0) {
              const hostFeed = getHost(feedsEl.feed.link);
              const aAllTagsArr = [...document.querySelectorAll('a')];
              const aFirstFeedTag = aAllTagsArr.find((aTag) => {
                const host = getHost(aTag.href);
                return host === hostFeed && aTag.parentElement.tagName === 'TD';
              });
              feedsEl.data.slice().reverse().forEach((feedElem) => {
                const parentElTBody = aFirstFeedTag.closest('tbody');
                const trTag = document.createElement('tr');
                const tdTag = document.createElement('td');
                const aTag = document.createElement('a');
                aTag.addEventListener('click', handlerATag);
                aTag.setAttribute('data-toggle', 'modal');
                aTag.setAttribute('data-target', '#modalItem');
                const { title, link } = feedElem;
                aTag.textContent = title;
                aTag.href = link;
                trTag.appendChild(tdTag.appendChild(aTag));
                parentElTBody.insertBefore(trTag, parentElTBody.firstChild);
              });
            }
          });
        })
        .catch(error => console.error(error));
    }
  }, 5000);
};

export default rssReader;
