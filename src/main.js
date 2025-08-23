import {Router} from '@vaadin/router';
import {store} from './store.js'; // TODO: Remove if won't be needed
import './routes/home/home.js';
import './routes/update/update.js';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

router.setRoutes([
  {path: '/', component: 'home-view'},
  {path: '/update', component: 'update-view'},
]);
