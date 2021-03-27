import React from 'react';
import { Switch } from 'react-router-dom';

import MyRoute from './MyRoute';
import Aluno from '../pages/Aluno';
import Fotos from '../pages/Fotos';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Page404 from '../pages/Page404';
import Home from '../pages/Home';
import Funcao from '../pages/Funcao';
import Cargo from '../pages/Cargo';
import Congregacao from '../pages/Congregacao';
import Classe from '../pages/Classe';

export default function Routes() {
  return (
    <Switch>
      <MyRoute exact path="/" component={Home} isClosed={false} />
      <MyRoute path="/aluno/:id/edit" component={Aluno} isClosed />
      <MyRoute path="/aluno/" component={Aluno} isClosed />
      <MyRoute path="/fotos/:id" component={Fotos} isClosed />
      <MyRoute path="/login/" component={Login} isClosed={false} />
      <MyRoute path="/register/" component={Register} isClosed={false} />
      <MyRoute path="/funcao/:id/edit" component={Funcao} isClosed={false} />
      <MyRoute path="/funcao/" component={Funcao} isClosed={false} />
      <MyRoute path="/cargo/:id/edit" component={Cargo} isClosed={false} />
      <MyRoute path="/cargo/" component={Cargo} isClosed={false} />
      <MyRoute path="/classe/:id/edit" component={Classe} isClosed={false} />
      <MyRoute path="/classe/" component={Classe} isClosed={false} />
      <MyRoute
        path="/congregacao/:id/edit"
        component={Congregacao}
        isClosed={false}
      />
      <MyRoute path="/congregacao/" component={Congregacao} isClosed={false} />
      <MyRoute path="*" component={Page404} />
    </Switch>
  );
}
