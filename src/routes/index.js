import React from 'react';
import { Switch } from 'react-router-dom';

import { useSelector } from 'react-redux';
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
import CaixaEbd from '../pages/CaixaEbd';
import RelatorioCaixa from '../pages/RelatorioCaixa';
import Abatimento from '../pages/Abatimento';
import RelatorioAbatimento from '../pages/RelatorioAbatimento';
import Dizimo from '../pages/Dizimo';
import RelatorioDizimo from '../pages/RelatorioDizimo';
import RelatorioDizimoGeral from '../pages/RelatorioDizimoGeral';
import CadAluno from '../pages/CadAluno';
import ListAluno from '../pages/ListAluno';
import DetailAluno from '../pages/DetailAluno';
import Chamada from '../pages/Chamada';
import RelatorioPresencaDiaria from '../pages/RelatorioPresencaDiaria';
import RelatorioPresencaGeral from '../pages/RelatorioPresencaGeral';
import PresencaDetalhada from '../pages/PresencaDetalhada';
import ListaAniversario from '../pages/ListaAniversario';
import EditPass from '../pages/EditPass';
import RelatorioDiario from '../pages/RelatorioDiario';
import RelatorioCaixaEbd from '../pages/RelatorioCaixaEbd';
import Configuracoes from '../pages/Configuracoes';
import Ebd from '../pages/Ebd';
import Secretaria from '../pages/Secretaria';
import Tesoraria from '../pages/Tesoraria';

export default function Routes() {
  const idFuncao = useSelector((state) => state.auth.user.function_id);

  /*
    1 - Admistrador
    2 - Dirigente
    3 - Tesoureiro
    4 - Secretario
    5 - Coordenador
    6 - Tesoureiro EBD
    7 -  Professor
    8 - Coordenador Congregacao
  */
  return (
    <Switch>
      <MyRoute exact path="/" component={Home} isClosed={false} />
      <MyRoute path="/aluno/:id/edit" component={Aluno} isClosed />
      <MyRoute path="/aluno/" component={Aluno} isClosed />
      <MyRoute
        path="/configuracoes/"
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 4 }]}
        component={Configuracoes}
        isClosed
      />
      <MyRoute
        path="/ebd/"
        idFuncao={idFuncao}
        usuarioPermitido={[
          { id: 1 },
          { id: 2 },
          { id: 5 },
          { id: 6 },
          { id: 7 },
          { id: 8 },
        ]}
        component={Ebd}
        isClosed
      />
      <MyRoute
        path="/secretaria/"
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 4 }]}
        component={Secretaria}
        isClosed
      />
      <MyRoute
        path="/tesoraria/"
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        component={Tesoraria}
        isClosed
      />

      <MyRoute path="/fotos/:id" component={Fotos} isClosed />
      <MyRoute path="/login/" component={Login} isClosed={false} />
      <MyRoute path="/register/" component={Register} isClosed={false} />
      <MyRoute
        path="/funcao/:id/edit"
        component={Funcao}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }]}
        isClosed
      />
      <MyRoute
        path="/funcao/"
        component={Funcao}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }]}
        isClosed
      />
      <MyRoute
        path="/cargo/:id/edit"
        component={Cargo}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 4 }]}
        isClosed
      />
      <MyRoute
        path="/cargo/"
        component={Cargo}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 4 }]}
        isClosed
      />
      <MyRoute
        path="/classe/:id/edit"
        component={Classe}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 5 }, { id: 7 }]}
        isClosed
      />
      <MyRoute
        path="/classe/"
        component={Classe}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 5 }]}
        isClosed
      />
      <MyRoute
        path="/cadMembro/:id/edit"
        component={CadMembro}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 4 }]}
        isClosed
      />
      <MyRoute
        path="/cadMembro/"
        component={CadMembro}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 4 }]}
        isClosed
      />
      <MyRoute
        path="/editPass/"
        component={EditPass}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 4 }]}
        isClosed
      />
      <MyRoute
        path="/departamento/:id/edit"
        component={Departamento}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 4 }]}
        isClosed
      />
      <MyRoute
        path="/departamento/"
        component={Departamento}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 4 }]}
        isClosed
      />
      <MyRoute
        path="/congregacao/:id/edit"
        component={Congregacao}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 4 }]}
        isClosed
      />
      <MyRoute
        path="/congregacao/"
        component={Congregacao}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 4 }]}
        isClosed
      />
      <MyRoute
        path="/listMembros/"
        component={ListMembros}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 4 }]}
        isClosed
      />
      <MyRoute
        path="/listAniversario/"
        component={ListaAniversario}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 4 }]}
        isClosed
      />
      <MyRoute
        path="/detailMembro/:id"
        component={DetailMembro}
        isClosed={false}
      />
      <MyRoute
        path="/relatorioDiario"
        component={RelatorioDiario}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        isClosed
      />
      <MyRoute
        path="/caixa/:id/edit"
        component={Caixa}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        isClosed
      />
      <MyRoute
        path="/caixa/"
        component={Caixa}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        isClosed
      />
      <MyRoute
        path="/caixaEbd/:id/edit"
        component={CaixaEbd}
        idFuncao={idFuncao}
        usuarioPermitido={[
          { id: 1 },
          { id: 2 },
          { id: 5 },
          { id: 6 },
          { id: 8 },
        ]}
        isClosed
      />
      <MyRoute
        path="/caixaEbd/"
        component={CaixaEbd}
        idFuncao={idFuncao}
        usuarioPermitido={[
          { id: 1 },
          { id: 2 },
          { id: 5 },
          { id: 6 },
          { id: 8 },
        ]}
        isClosed
      />
      <MyRoute
        path="/relatorioCaixaEbd/"
        component={RelatorioCaixaEbd}
        idFuncao={idFuncao}
        usuarioPermitido={[
          { id: 1 },
          { id: 2 },
          { id: 5 },
          { id: 6 },
          { id: 8 },
        ]}
        isClosed
      />
      <MyRoute
        path="/abatimento/:id/edit"
        component={Abatimento}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 3 }]}
        isClosed
      />
      <MyRoute
        path="/abatimento/"
        component={Abatimento}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 3 }]}
        isClosed
      />
      <MyRoute
        path="/dizimo/:id/edit"
        component={Dizimo}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        isClosed
      />
      <MyRoute
        path="/dizimo/"
        component={Dizimo}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        isClosed
      />
      <MyRoute
        path="/relatorioCaixa/"
        component={RelatorioCaixa}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        isClosed
      />
      <MyRoute
        path="/relatorioDizimo/"
        component={RelatorioDizimo}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        isClosed
      />
      <MyRoute
        path="/relatorioDizimoGeral/"
        component={RelatorioDizimoGeral}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        isClosed
      />
      <MyRoute
        path="/relatorioAbatimento/"
        component={RelatorioAbatimento}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 3 }]}
        isClosed
      />
      <MyRoute
        path="/cadAluno/:id/edit"
        component={CadAluno}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 5 }]}
        isClosed
      />
      <MyRoute
        path="/cadAluno/"
        component={CadAluno}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 5 }]}
        isClosed
      />
      <MyRoute
        path="/listAluno/"
        component={ListAluno}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 5 }]}
        isClosed
      />
      <MyRoute
        path="/chamada/"
        component={Chamada}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 5 }, { id: 7 }]}
        isClosed
      />
      <MyRoute
        path="/detailAluno/:id"
        component={DetailAluno}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 5 }]}
        isClosed
      />
      <MyRoute
        path="/PresencaDetalhada/"
        component={PresencaDetalhada}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 5 }]}
        isClosed
      />
      <MyRoute
        path="/relatorioPresencaDiaria/"
        component={RelatorioPresencaDiaria}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 5 }, { id: 7 }]}
        isClosed
      />
      <MyRoute
        path="/relatorioPresencaGeral/"
        component={RelatorioPresencaGeral}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 5 }]}
        isClosed
      />
      <MyRoute path="*" component={Page404} />
    </Switch>
  );
}
