import axios from '../services/axios';

/* eslint-disable no-param-reassign */
export const inicioPrimeiroTrimestre = '2022-01-01';
export const fimPrimeiroTrimestre = '2022-03-31';
export const inicioSegundoTrimestre = '2022-04-01';
export const fimSegundoTrimestre = '2022-06-30';
export const inicioTerceiroTrimestre = '2022-07-01';
export const fimTerceiroTrimestre = '2022-09-30';

export const inicioQuartoTrimestre = '2022-10-01';
export const fimQuartoTrimestre = '2022-12-31';

export const trimestres = [
  { id: 0, descricao: 'Primeiro Trimestre' },
  { id: 1, descricao: 'Segundo Trimestre' },
  { id: 2, descricao: 'Terceiro Trimestre' },
  { id: 3, descricao: 'Quarto Trimestre' },
];
export const listMeses = [
  { id: 0, descricao: 'Janeiro' },
  { id: 1, descricao: 'Fevereiro' },
  { id: 2, descricao: 'Março' },
  { id: 3, descricao: 'Abril' },
  { id: 4, descricao: 'Maio' },
  { id: 5, descricao: 'Junho' },
  { id: 6, descricao: 'Julho' },
  { id: 7, descricao: 'Agosto' },
  { id: 8, descricao: 'Setembro' },
  { id: 9, descricao: 'Outubro' },
  { id: 10, descricao: 'Novembro' },
  { id: 11, descricao: 'Dezembro' },
];
export const getToday = () => {
  let dataAtual = new Date();
  dataAtual = `${dataAtual.getDate()}/${
    dataAtual.getMonth() + 1
  }/${dataAtual.getFullYear()}`;
  return dataAtual;
};
export const getDataDB = (valor) => {
  valor = `${valor.getDate() + 1}/${
    valor.getMonth() + 1
  }/${valor.getFullYear()}`;
  return valor;
};
export const getDataBanco = (valor) => {
  valor = `${valor.getDate()}/${valor.getMonth() + 1}/${valor.getFullYear()}`;
  return valor;
};
export const formataDataInput = (valor) => {
  valor = new Date(valor);
  valor = `${valor.getDate() + 1}/${
    valor.getMonth() + 1
  }/${valor.getFullYear()}`;
  return valor;
};
export const formataDataInputInverso = (valor) => {
  valor = new Date(valor);
  valor = `${valor.getFullYear()}-${valor.getMonth() + 1}-${valor.getDate()}`;
  return valor;
};
export const getMes = (valor) => {
  valor = new Date(valor);
  valor = valor.getMonth() + 1;
  return valor;
};
export const buscaCep = async (cep) => {
  cep = cep.replace('-', '');
  const response = await axios.post('/correio', { cep });
  return response.data;
};

export const statusPedido = [
  { id: 0, descricao: 'Pendente' },
  { id: 1, descricao: 'Encomendado' },
  { id: 2, descricao: 'Entregue' },
];
export const meioPagamento = [
  { id: 0, descricao: 'Pix' },
  { id: 1, descricao: 'Dinheiro' },
  { id: 2, descricao: 'Pendente' },
];
