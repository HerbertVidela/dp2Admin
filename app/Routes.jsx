import React from 'react';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { hot } from 'react-hot-loader';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';
import BaseHorizontal from './components/Layout/BaseHorizontal';
import DashboardV1 from './components/Dashboard/DashboardV1';
// import FormStandard from './components/Forms/FormStandard';
// import FormValidation from './components/Forms/FormValidation';

import Login from './components/Pages/Login';
import Register from './components/Pages/Register';
import Recover from './components/Pages/Recover';
import Lock from './components/Pages/Lock';
import NotFound from './components/Pages/NotFound';
import Error500 from './components/Pages/Error500';
import Maintenance from './components/Pages/Maintenance';

import pages from './Pages';
import { getNumber } from './Utils/randomizer';

// List of routes that uses the page layout
// listed here to Switch between layouts
// depending on the current pathname
const listofPages = [
    '/login',
    '/register',
    '/recover',
    '/lock',
    '/notfound',
    '/error500',
    '/maintenance'
];

const Routes = ({ location }) => {
    const currentKey = location.pathname.split('/')[1] || '/';
    const timeout = { enter: 500, exit: 500 };

    // Animations supported
    //      'rag-fadeIn'
    //      'rag-fadeInUp'
    //      'rag-fadeInDown'
    //      'rag-fadeInRight'
    //      'rag-fadeInLeft'
    //      'rag-fadeInUpBig'
    //      'rag-fadeInDownBig'
    //      'rag-fadeInRightBig'
    //      'rag-fadeInLeftBig'
    //      'rag-zoomBackDown'
    const animationName = 'rag-fadeIn'

    if(listofPages.indexOf(location.pathname) > -1) {
        return (
            // Page Layout component wrapper
            <BasePage>
                <Switch location={location}>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/recover" component={Recover}/>
                    <Route path="/lock" component={Lock}/>
                    <Route path="/notfound" component={NotFound}/>
                    <Route path="/error500" component={Error500}/>
                    <Route path="/maintenance" component={Maintenance}/>
                </Switch>
            </BasePage>
        )
    }
    else {
        return (
            <Base>
              <TransitionGroup>
                <CSSTransition key={currentKey} timeout={timeout} classNames={animationName} exit={false}>
                    <div>
                        <Switch location={location}>
                            {/*Dashboard*/}
                            <Route path="/dashboard" component={DashboardV1}/>
                            {/* <Route path="/form-standard" component={FormStandard}/>
                            <Route path="/form-validation" component={FormValidation}/> */}
                            { pages.map(page => (
                                <Route
                                    key={getNumber()}
                                    path={page.path}
                                    component={page.component}
                                />
                            )) }
                            <Redirect to="/dashboard" />
                        </Switch>
                    </div>
                </CSSTransition>
              </TransitionGroup>
            </Base>
        )
    }
}

export default hot(module)(withRouter(Routes));