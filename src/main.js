import {Router} from '@vaadin/router';
import './routes/home/home.js';
import './routes/update/update.js';
import './routes/create/create.js';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

router.setRoutes([
  {path: '/', component: 'home-view'},
  {path: '/update', component: 'update-view'},
  {path: '/add', component: 'create-view'},
]);
