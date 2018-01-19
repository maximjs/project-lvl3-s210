import axios from 'axios';
import isURL from 'validator/lib/isURL';

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

const modalItem = `
<div class="modal fade" id="modalItem" tabindex="-1" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-body">
      <h5></h5>
      <a></a>
    </div>
    <div class="modal-footer">
      <button class="btn btn-default" type="button" data-dismiss="modal">Close</button>
    </div>
    </div>
  </div>
</div>
`;

const handlerATag = (event) => {
  event.preventDefault();
  const { href } = event.target;
  const dataItem = findItem(href);
  const { description } = dataItem;
  if (!divJumb.querySelector('#modalItem')) {
    const divModal = document.createElement('div');
    divModal.innerHTML = modalItem;
    const modal = divModal.children[0];
    divJumb.appendChild(modal);
  }
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

const handlerForm = input => (event) => {
  event.preventDefault();
  const inputForm = input;
  inputForm.classList.remove('is-valid', 'is-invalid');
  inputForm.value = '';
  if (!document.querySelector('#feedsTable')) {
    createFeedsTable();
  }
  axios.get(state.input, { withCredentials: true })
    .then((resp) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(resp.data, 'text/html');
      return doc;
    })
    .then((doc) => {
      const channel = doc.querySelector('channel');
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
      feedObj.data = [...dataFeed];
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
};

export default rssReader;
