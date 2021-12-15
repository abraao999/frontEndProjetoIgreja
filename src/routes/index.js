import React from 'react';
import { Switch } from 'react-router-dom';

import { useSelector } from 'react-redux';
import MyRoute from './MyRoute';
import Aluno from '../pages/Aluno';
import Fotos from '../pages/Fotos';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Page404 from '../pages/Page404';
import Painel from '../pages/Painel';
import Funcao from '../pages/AbaConfiguracoes/Funcao';
import Cargo from '../pages/AbaConfiguracoes/Cargo';
import Congregacao from '../pages/AbaConfiguracoes/Congregacao';
import Classe from '../pages/AbaConfiguracoes/Classe';
import Departamento from '../pages/AbaConfiguracoes/Departamento';
import CadMembro from '../pages/AbaSecretaria/CadMembro';
import ListMembros from '../pages/AbaSecretaria/ListMembros';
import DetailMembro from '../pages/AbaSecretaria/DetailMembro';
import Caixa from '../pages/AbaCaixa/Caixa';
import CaixaEbd from '../pages/AbaEdb/CaixaEbd';
import RelatorioCaixa from '../pages/AbaCaixa/RelatorioCaixa';
import Abatimento from '../pages/AbaCaixa/Abatimento';
import RelatorioAbatimento from '../pages/AbaCaixa/RelatorioAbatimento';
import Dizimo from '../pages/AbaCaixa/Dizimo';
import RelatorioDizimo from '../pages/AbaCaixa/RelatorioDizimo';
import RelatorioDizimoGeral from '../pages/AbaCaixa/RelatorioDizimoGeral';
import CadAluno from '../pages/AbaEdb/CadAluno';
import ListAluno from '../pages/AbaEdb/ListAluno';
import DetailAluno from '../pages/AbaEdb/DetailAluno';
import Chamada from '../pages/AbaEdb/Chamada';
import RelatorioPresencaDiaria from '../pages/AbaEdb/RelatorioPresencaDiaria';
import RelatorioPresencaGeral from '../pages/AbaEdb/RelatorioPresencaGeral';
import PresencaDetalhada from '../pages/AbaEdb/PresencaDetalhada';
import ListaAniversario from '../pages/AbaSecretaria/ListaAniversario';
import EditPass from '../pages/AbaSecretaria/EditPass';
import RelatorioDiario from '../pages/AbaCaixa/RelatorioDiario';
import RelatorioCaixaEbd from '../pages/AbaEdb/RelatorioCaixaEbd';
import Configuracoes from '../pages/AbaConfiguracoes/Configuracoes';
import Ebd from '../pages/AbaEdb/Ebd';
import Secretaria from '../pages/AbaSecretaria/Secretaria';
import Tesoraria from '../pages/AbaCaixa/Tesoraria';
import Home from '../pages/Home';
import NovoVisitante from '../pages/AbaCulto/NovoVisitante';
import ListaVisitantes from '../pages/AbaCulto/ListaVisitantes';
import MediaCaixa from '../pages/AbaCaixa/MediaCaixa';

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
    9 - Tesoureiro Congregacao
  */
  return (
    <Switch>
      <MyRoute exact path="/" component={Painel} isClosed={false} />
      <MyRoute exact path="/home" component={Home} isClosed={false} />
      <MyRoute
        exact
        path="/novoVisitante"
        component={NovoVisitante}
        isClosed={false}
      />
      <MyRoute
        exact
        path="/listaVisitantes"
        component={ListaVisitantes}
        isClosed={false}
      />
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
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 9 }]}
        isClosed
      />
      <MyRoute
        path="/caixa/:id/edit"
        component={Caixa}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 9 }]}
        isClosed
      />
      <MyRoute
        path="/caixa/"
        component={Caixa}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 9 }]}
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
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 9 }]}
        isClosed
      />
      <MyRoute
        path="/dizimo/"
        component={Dizimo}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 9 }]}
        isClosed
      />
      <MyRoute
        path="/relatorioCaixa/"
        component={RelatorioCaixa}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 9 }]}
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
        path="/mediaCaixa/"
        component={MediaCaixa}
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
