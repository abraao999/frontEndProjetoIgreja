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
import Departamento from '../pages/Departamento';
import CadMembro from '../pages/CadMembro';
import ListMembros from '../pages/ListMembros';
import DetailMembro from '../pages/DetailMembro';
import Caixa from '../pages/Caixa';
import RelatorioCaixa from '../pages/RelatorioCaixa';
import Abatimento from '../pages/Abatimento';
import RelatorioAbatimento from '../pages/RelatorioAbatimento';
import Dizimo from '../pages/Dizimo';
import RelatorioDizimo from '../pages/RelatorioDizimo';
import RelatorioDizimoGeral from '../pages/RelatorioDizimoGeral';
import CadAluno from '../pages/CadAluno';

export default function Routes() {
  return (
    <Switch>
      <MyRoute exact path="/" component={Home} isClosed={false} />
      <MyRoute path="/aluno/:id/edit" component={Aluno} isClosed />
      <MyRoute path="/aluno/" component={Aluno} isClosed />
      <MyRoute path="/fotos/:id" component={Fotos} isClosed />
      <MyRoute path="/login/" component={Login} isClosed={false} />
      <MyRoute path="/register/" component={Register} isClosed={false} />
      <MyRoute path="/funcao/:id/edit" component={Funcao} isClosed />
      <MyRoute path="/funcao/" component={Funcao} isClosed />
      <MyRoute path="/cargo/:id/edit" component={Cargo} isClosed />
      <MyRoute path="/cargo/" component={Cargo} isClosed />
      <MyRoute path="/classe/:id/edit" component={Classe} isClosed />
      <MyRoute path="/classe/" component={Classe} isClosed />
      <MyRoute path="/cadMembro/:id/edit" component={CadMembro} isClosed />
      <MyRoute path="/cadMembro/" component={CadMembro} isClosed />
      <MyRoute
        path="/departamento/:id/edit"
        component={Departamento}
        isClosed
      />
      <MyRoute path="/departamento/" component={Departamento} isClosed />
      <MyRoute path="/congregacao/:id/edit" component={Congregacao} isClosed />
      <MyRoute path="/congregacao/" component={Congregacao} isClosed />
      <MyRoute path="/listMembros/" component={ListMembros} isClosed />
      <MyRoute path="/detailtMembro/:id" component={DetailMembro} isClosed />
      <MyRoute path="/caixa/:id/edit" component={Caixa} isClosed />
      <MyRoute path="/caixa/" component={Caixa} isClosed />
      <MyRoute path="/abatimento/:id/edit" component={Abatimento} isClosed />
      <MyRoute path="/abatimento/" component={Abatimento} isClosed />
      <MyRoute path="/dizimo/:id/edit" component={Dizimo} isClosed />
      <MyRoute path="/dizimo/" component={Dizimo} isClosed />
      <MyRoute path="/relatorioCaixa/" component={RelatorioCaixa} isClosed />
      <MyRoute path="/relatorioDizimo/" component={RelatorioDizimo} isClosed />
      <MyRoute
        path="/relatorioDizimoGeral/"
        component={RelatorioDizimoGeral}
        isClosed
      />
      <MyRoute
        path="/relatorioAbatimento/"
        component={RelatorioAbatimento}
        isClosed
      />
      <MyRoute path="/cadAluno/:id/edit" component={CadAluno} isClosed />
      <MyRoute path="/cadAluno/" component={CadAluno} isClosed />
      <MyRoute path="*" component={Page404} />
    </Switch>
  );
}
