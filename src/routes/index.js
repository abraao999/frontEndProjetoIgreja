import React from "react";
import { Switch } from "react-router-dom";

import { useSelector } from "react-redux";
import MyRoute from "./MyRoute";
import Aluno from "../pages/Aluno";
import Fotos from "../pages/Fotos";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Page404 from "../pages/Page404";
import Painel from "../pages/Painel";
import Funcao from "../pages/AbaConfiguracoes/Funcao";
import Cargo from "../pages/AbaConfiguracoes/Cargo";
import Congregacao from "../pages/AbaConfiguracoes/Congregacao";
import Classe from "../pages/AbaConfiguracoes/Classe";
import Departamento from "../pages/AbaConfiguracoes/Departamento";
import CadMembro from "../pages/AbaSecretaria/CadMembro";
import ListMembros from "../pages/AbaSecretaria/ListMembros";
import DetailMembro from "../pages/AbaSecretaria/DetailMembro";
import Caixa from "../pages/AbaCaixa/Caixa";
import CaixaEbd from "../pages/AbaEdb/CaixaEbd";
import RelatorioCaixa from "../pages/AbaCaixa/RelatorioCaixa";
import Abatimento from "../pages/AbaCaixa/Abatimento";
import RelatorioAbatimento from "../pages/AbaCaixa/RelatorioAbatimento";
import Dizimo from "../pages/AbaCaixa/Dizimo";
import RelatorioDizimo from "../pages/AbaCaixa/RelatorioDizimo";
import RelatorioDizimoGeral from "../pages/AbaCaixa/RelatorioDizimoGeral";
import CadAluno from "../pages/AbaEdb/CadAluno";
import ListAluno from "../pages/AbaEdb/ListAluno";
import DetailAluno from "../pages/AbaEdb/DetailAluno";
import Chamada from "../pages/AbaEdb/Chamada";
import RelatorioPresencaDiaria from "../pages/AbaEdb/RelatorioPresencaDiaria";
import RelatorioPresencaGeral from "../pages/AbaEdb/RelatorioPresencaGeral";
import PresencaDetalhada from "../pages/AbaEdb/PresencaDetalhada";
import ListaAniversario from "../pages/AbaSecretaria/ListaAniversario";
import EditPass from "../pages/AbaSecretaria/EditPass";
import RelatorioDiario from "../pages/AbaCaixa/RelatorioDiario";
import RelatorioCaixaEbd from "../pages/AbaEdb/RelatorioCaixaEbd";
import Configuracoes from "../pages/AbaConfiguracoes/Configuracoes";
import Ebd from "../pages/AbaEdb/Ebd";
import Secretaria from "../pages/AbaSecretaria/Secretaria";
import Tesoraria from "../pages/AbaCaixa/Tesoraria";
import Home from "../pages/Home";
import NovoVisitante from "../pages/AbaCulto/NovoVisitante";
import ListaVisitantes from "../pages/AbaCulto/ListaVisitantes";
import MediaCaixa from "../pages/AbaCaixa/MediaCaixa";
import Visitante from "../pages/AbaCulto/VIsitante";
import PedidoOracao from "../pages/AbaCulto/PedidoOracao";
import NovoPedido from "../pages/AbaCulto/NovoPedido";
import ListaPedido from "../pages/AbaCulto/ListaPedido";
import RelatorioDizimoDiario from "../pages/AbaCaixa/RelatorioDizimoDiario";
import ControleAcesso from "../pages/AbaSecretaria/ControleAcesso";
import ControleCarterinha from "../pages/AbaSecretaria/ControleCarterinha";
import MeuCadastro from "../pages/AbaPerfil/MeuCadastro";
import Perfil from "../pages/AbaPerfil/Perfil";
import CadLivro from "../pages/AbaLivraria/CadLivro";
import Venda from "../pages/AbaLivraria/Venda";
import Livraria from "../pages/AbaLivraria/Livraria";
import PedidoLivro from "../pages/AbaLivraria/PedidoLivro";
import ListaPedidoLivraria from "../pages/AbaLivraria/ListaPedidoLivraria";
import Estoque from "../pages/AbaLivraria/Estoque";
import RelatorioVendas from "../pages/AbaLivraria/RelatorioVendas";
import CadCamiseta from "../pages/AbaLivraria/CadCamiseta";
import VendaCamiseta from "../pages/AbaLivraria/VendaCamiseta";
import RelatorioVendaCamiseta from "../pages/AbaLivraria/RelatorioVendasCamiseta";
import Fiado from "../pages/AbaLivraria/Fiados";
import LivrariaVirtual from "../pages/AbaLivrariaVirtual/LivrariaVirtual";
import Reserva from "../pages/AbaLivraria/Reserva";
import PainelLivrariaAberta from "../pages/AbaLivrariaVirtual/PainelLivrariaAberta";
import PedidoLivroAberto from "../pages/AbaLivrariaVirtual/PedidoLivroAberto";
import PedidoRevista from "../pages/AbaLivraria/PedidoRevista";
import ListaPedidoRevista from "../pages/AbaLivraria/ListaRevista";
import LivrariaLivro from "../pages/AbaLivraria/LivrariaLivro";
import LivrariaCamiseta from "../pages/AbaLivraria/LivrariaCamiseta";
import LivrariaRevista from "../pages/AbaLivraria/LivrariaRevista";
import CadFoto from "../pages/CadFoto";
import Sorteio from "../pages/AbaEdb/RelatorioPresencaGeral";

export default function Routes() {
  const idFuncao = useSelector((state) => state.auth.function_id);
  console.log(idFuncao);
  /*
    1 - Admistrador
    2 - Dirigente
    3 - Tesoureiro
    4 - Secretario
    5 - Coordenador
    6 - Tesoureiro EBD
    7 -  Professor
    8 - outros
    9 - Tesoureiro Congregacao
    10 - secretario ebd
    11 - diretor escola teológica
    12 - secretario escola teológica
    13 - adm livraria
    14 - user livraria
  */
  return (
    <Switch>
      <MyRoute exact path="/" component={Painel} isClosed={false} />
      <MyRoute path="/home" component={Home} isClosed={false} />
      <MyRoute
        path="/novoVisitante"
        component={NovoVisitante}
        isClosed={false}
      />
      <MyRoute
        path="/listaVisitantes"
        component={ListaVisitantes}
        isClosed={false}
      />
      <MyRoute
        path="/dizimoDiario"
        component={RelatorioDizimoDiario}
        isClosed={false}
      />
      <MyRoute path="/visitante" component={Visitante} isClosed={false} />
      <MyRoute path="/pedidoOracao" component={PedidoOracao} isClosed={false} />
      <MyRoute path="/novoPedido" component={NovoPedido} isClosed={false} />
      <MyRoute path="/listaPedido" component={ListaPedido} isClosed={false} />
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
          { id: 10 },
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
      <MyRoute path="/editPass/:id/" component={EditPass} isClosed={false} />
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
        path="/controleAcesso/"
        component={ControleAcesso}
        idFuncao={idFuncao}
        usuarioPermitido={[{ id: 1 }, { id: 2 }, { id: 4 }]}
        isClosed
      />
      <MyRoute
        path="/controleCarterinha/"
        component={ControleCarterinha}
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
          { id: 10 },
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
          { id: 10 },
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
          { id: 10 },
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
        path="/sorteio/"
        component={Sorteio}
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

      <MyRoute
        path="/meuCadastro/"
        component={MeuCadastro}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
          { id: 6 },
          { id: 7 },
          { id: 8 },
          { id: 9 },
          { id: 10 },
          { id: 11 },
          { id: 12 },
        ]}
      />
      <MyRoute
        path="/perfil/"
        component={Perfil}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
          { id: 6 },
          { id: 7 },
          { id: 8 },
          { id: 9 },
          { id: 10 },
          { id: 11 },
          { id: 12 },
        ]}
      />
      <MyRoute
        path="/livraria"
        component={Livraria}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/cadLivro/:id/edit"
        component={CadLivro}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/cadLivro/"
        component={CadLivro}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/venda/:id/:acao"
        component={Venda}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/venda/"
        component={Venda}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/vendaCamiseta/:id/edit"
        component={VendaCamiseta}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/vendaCamiseta/"
        component={VendaCamiseta}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/pedidoLivroAberto"
        component={PedidoLivroAberto}
        isClosed={false}
      />
      <MyRoute
        path="/pedidoLivro/:nomeLivro/nomeLivro"
        component={PedidoLivro}
        isClosed={false}
      />
      <MyRoute
        path="/pedidoLivro/:id/edit"
        component={PedidoLivro}
        isClosed={false}
      />
      <MyRoute path="/pedidoLivro/" component={PedidoLivro} isClosed={false} />
      <MyRoute
        path="/ListaPedidoLivraria/"
        component={ListaPedidoLivraria}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/ListaPedidoRevista/"
        component={ListaPedidoRevista}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/pedidoRevista/"
        component={PedidoRevista}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/pedidoRevista/:id/edit"
        component={PedidoRevista}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/estoque/"
        component={Estoque}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/relatorioVendas/"
        component={RelatorioVendas}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/relatorioVendaCamiseta/"
        component={RelatorioVendaCamiseta}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/cadCamiseta/:id/edit"
        component={CadCamiseta}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/listaPedidoRevista/"
        component={ListaPedidoRevista}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/cadCamiseta/"
        component={CadCamiseta}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/fiado/"
        component={Fiado}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/painelLivrariaVirtual/"
        component={PainelLivrariaAberta}
        isClosed={false}
      />
      <MyRoute
        path="/livrariaVirtual/"
        component={LivrariaVirtual}
        isClosed={false}
      />
      <MyRoute
        path="/reservaLivros/"
        component={Reserva}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/painelLivrariaLivros/"
        component={LivrariaLivro}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/painelLivrariaCamisetas/"
        component={LivrariaCamiseta}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/painelLivrariaRevistas/"
        component={LivrariaRevista}
        idFuncao={idFuncao}
        isClosed
        usuarioPermitido={[{ id: 1 }, { id: 13 }, { id: 14 }]}
      />
      <MyRoute
        path="/cadFoto/:id/:action"
        component={CadFoto}
        idFuncao={idFuncao}
        isClosed={false}
      />
      <MyRoute path="*" component={Page404} />
    </Switch>
  );
}
