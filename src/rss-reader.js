import axios from 'axios';
import isURL from 'validator/lib/isURL';

const state = { input: '', isValidInput: null, dataFeed: [] };

const getDataFeed = channelArr =>
  channelArr.map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('guid').textContent;
    const description = item.querySelector('description').textContent;
    return { title, link, description };
  });

const handlerATag = (event) => {
  event.preventDefault();
  if (event.target.tagName === 'A') {
    const { href } = event.target;
    const dataItem = state.dataFeed.find(el => el.link === href);
    const { description } = dataItem;
    const modal = document.body.querySelector('#modalItem');
    const h5 = modal.querySelector('h5');
    h5.innerHTML = description;
    const a = modal.querySelector('a');
    a.href = href;
    a.textContent = href;
  }
};

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

const handlerForm = input => (event) => {
  event.preventDefault();
  const inputForm = input;
  inputForm.classList.remove('is-valid', 'is-invalid');
  inputForm.value = '';
  if (!document.querySelector('table')) {
    const table = document.createElement('table');
    table.className = 'table-bordered';
    table.id = 'feeds';
    const divJumb = document.querySelector('.jumbotron');
    const divTable = document.createElement('div');
    divTable.className = 'my-3';
    divTable.appendChild(table);
    divJumb.appendChild(divTable);
  }
  axios.get(state.input)
    .then((resp) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(resp.data, 'text/html');
      const channel = doc.querySelector('channel');
      if (!channel) {
        throw new Error('This is not the rss feed');
      }
      const titleFeed = channel.querySelector('title');
      const descrFeed = channel.querySelector('description');
      const table = document.querySelector('#feeds');
      const row = table.insertRow();
      const cellTitle = row.insertCell();
      cellTitle.className = 'p-1';
      cellTitle.innerHTML = titleFeed.innerHTML;
      if (descrFeed.childNodes.length === 1) {
        const cellDescr = row.insertCell();
        cellDescr.className = 'p-1';
        cellDescr.innerHTML = descrFeed.innerHTML;
      }
      const container = document.querySelector('.container');
      const itemsTable = document.createElement('table');
      itemsTable.addEventListener('click', handlerATag);
      itemsTable.className = 'ml-3 table-striped';
      container.appendChild(itemsTable);
      const channelArr = [...channel.querySelectorAll('item')];
      const dataFeed = getDataFeed(channelArr);
      state.dataFeed = [...state.dataFeed, ...dataFeed];
      dataFeed.forEach((item) => {
        const { title, link } = item;
        const a = document.createElement('a');
        a.setAttribute('data-toggle', 'modal');
        a.setAttribute('data-target', '#modalItem');
        a.textContent = title;
        a.href = link;
        const itemRow = itemsTable.insertRow();
        const itemCell = itemRow.insertCell();
        itemCell.appendChild(a);
      });
      container.appendChild(document.createElement('hr'));
    })
    .then(() => {
      state.input = '';
      state.isValidInput = null;
    })
    .catch(error => console.error(new Error(`${state.input} ${error.message}`)));
};

const rssReader = () => {
  const form = document.querySelector('#rss-form');
  const input = form.querySelector('input');
  input.addEventListener('keyup', handlerInput(input));
  form.addEventListener('submit', handlerForm(input));
};

rssReader();
