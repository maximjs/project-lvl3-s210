import axios from 'axios';
import isURL from 'validator/lib/isURL';

const rssReader = () => {
  const form = document.querySelector('#rss-form');
  const input = form.querySelector('input');
  const state = { input: '', isValidInput: null };

  input.addEventListener('keyup', () => {
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
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    input.classList.remove('is-valid', 'is-invalid');
    input.value = '';
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
        const title = channel.querySelector('title');
        const description = channel.querySelector('description');
        const table = document.querySelector('#feeds');
        const row = table.insertRow();
        const cellTitle = row.insertCell();
        cellTitle.className = 'p-1';
        cellTitle.innerHTML = title.innerHTML;
        if (description.childNodes.length === 1) {
          const cellDescr = row.insertCell();
          cellDescr.className = 'p-1';
          cellDescr.innerHTML = description.innerHTML;
        }
        const container = document.querySelector('.container');
        const itemsTable = document.createElement('table');
        itemsTable.className = 'ml-3 table-striped';
        container.appendChild(itemsTable);
        const itemsArr = [...channel.querySelectorAll('item')];
        itemsArr.forEach((item) => {
          const itemTitle = item.querySelector('title').textContent;
          const itemLink = item.querySelector('guid').textContent;
          const a = document.createElement('a');
          a.textContent = itemTitle;
          a.href = itemLink;
          const itemRow = itemsTable.insertRow();
          const itemCell = itemRow.insertCell();
          itemCell.appendChild(a);
        });
        container.appendChild(document.createElement('br'));
      })
      .then(() => {
        state.input = '';
        state.isValidInput = null;
      })
      .catch(error => console.error(new Error(`${state.input} ${error.message}`)));
  });
};
rssReader();
