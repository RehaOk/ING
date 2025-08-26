import {Router} from '@vaadin/router';
import './routes/home/home.js';
import './routes/update/update.js';
import './routes/create/create.js';
import {store} from './store';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

store.subscribe(() => {
  const {localization} = store.getState();
  const translations = localization.translations;
  document.title = translations.index.appTitle;
});

router.setRoutes([
  {path: '/', component: 'home-view'},
  {path: '/update', component: 'update-view'},
  {path: '/add', component: 'create-view'},
]);
