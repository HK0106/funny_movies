import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {ROUTE_PATH} from '../../ts/enums';
import Home from '../../pages/Home';
import Page404 from '../../pages/Page404';
import ShareMovie from '../../pages/ShareMovie';
import PrivateRouter from '../PrivateRouter';

const Routes = () => {
  return(
    <BrowserRouter>
      <Switch>
        <PrivateRouter path={ROUTE_PATH.home} exact>
          <Home/>
        </PrivateRouter>
        <PrivateRouter path={ROUTE_PATH.shareMovie}>
          <ShareMovie/>
        </PrivateRouter>
        <Route path="*">
          <Page404 />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Routes;
