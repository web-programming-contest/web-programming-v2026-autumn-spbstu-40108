import {Travel} from './model.js';

let travels: Travel[] = [];

function executeAsync<T>(operation: () => T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(operation());
    }, 50);
  });
}

function saveState(): void {
  localStorage.setItem('travels', JSON.stringify(travels));
}

function loadState(): void {
  const saved = localStorage.getItem('travels');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      travels = parsed.map(
        (item: {
          id: number | string;
          travelerName: string;
          visitedCountries: string[];
        }) =>
          new Travel(Number(item.id), item.travelerName, item.visitedCountries),
      );
    } catch {
      travels = [];
    }
  }
}

function render(): void {
  const listContainer = document.querySelector('[data-testid="entity-list"]');
  if (!listContainer) {
    return;
  }
  listContainer.innerHTML = '';

  travels.forEach((travel) => {
    const card = document.createElement('article');
    card.setAttribute('data-testid', 'entity-card');
    card.className = 'travel-card';

    const title = document.createElement('h3');
    title.textContent = `${travel.travelerName} (ID: ${travel.id})`;

    const countInfo = document.createElement('p');
    countInfo.className = 'visited-count';
    countInfo.textContent = `Посещено стран: ${travel.visitedCount}`;

    const countriesList = document.createElement('ul');
    travel.visitedCountries.forEach((country) => {
      const li = document.createElement('li');
      li.textContent = `${country} `;

      const removeCountryBtn = document.createElement('button');
      removeCountryBtn.textContent = 'Удалить страну';
      removeCountryBtn.className = 'btn-small btn-remove-country';
      removeCountryBtn.addEventListener('click', () => {
        executeAsync(() => {
          travel.removeCountry(country);
          saveState();
        }).then(render);
      });

      li.appendChild(removeCountryBtn);
      countriesList.appendChild(li);
    });

    const addCountryForm = document.createElement('form');
    addCountryForm.className = 'add-country-form';
    addCountryForm.innerHTML = `
      <input type="text" name="newCountry" placeholder="Название страны" required />
      <button type="submit" class="btn-small">Добавить страну</button>
    `;
    addCountryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(addCountryForm);
      const newCountry = formData.get('newCountry') as string;

      if (newCountry.trim()) {
        executeAsync(() => {
          travel.addCountry(newCountry.trim());
          saveState();
        }).then(render);
      }
    });

    const deleteTravelBtn = document.createElement('button');
    deleteTravelBtn.setAttribute('data-testid', 'delete-entity');
    deleteTravelBtn.textContent = 'Удалить путешествие';
    deleteTravelBtn.className = 'btn-delete-entity';
    deleteTravelBtn.addEventListener('click', () => {
      executeAsync(() => {
        travels = travels.filter((t) => t.id !== travel.id);
        saveState();
      }).then(render);
    });

    card.appendChild(title);
    card.appendChild(countInfo);
    card.appendChild(countriesList);
    card.appendChild(addCountryForm);
    card.appendChild(deleteTravelBtn);

    listContainer.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  render();

  const form = document.querySelector(
    'form[data-testid="entity-form"]',
  ) as HTMLFormElement;
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const id = parseInt(formData.get('id') as string, 10);
      const travelerName = formData.get('travelerName') as string;

      if (!isNaN(id) && travelerName.trim() !== '') {
        executeAsync(() => {
          if (!travels.some((t) => t.id === id)) {
            travels.push(new Travel(id, travelerName.trim()));
            saveState();
          }
        }).then(() => {
          form.reset();
          render();
        });
      }
    });
  }
});
