import {PrivateRoute} from '../../ts/interface';
import AppLayout from '../../components/Applayout';
import {Redirect, Route} from 'react-router-dom';
import {ROUTE_PATH} from '../../ts/enums';


const PrivateRouter = ({children, ...rest}: PrivateRoute) => {
  const isLogin = true;

  return (
    <Route
      {...rest}
      render={({location}) => isLogin ? (
        <AppLayout>{children}</AppLayout>
      ) : (
        <Redirect to={{
          pathname: ROUTE_PATH.home,
          state: {from: location}
        }}/>
      )}
    />
  )
}

export default PrivateRouter;
