import {ROUTE_PATH} from '../../ts/enums';
import Home from '../../pages/Home';
import ShareMovie from '../../pages/ShareMovie';

export const DEFAULT_PATH = [
  {
    path: ROUTE_PATH.home,
    component: <Home />,
  },
  {
    path: ROUTE_PATH.shareMovie,
    component: <ShareMovie />,
  },
];
