import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';
import history from '../../../services/history';

function* loginRequest({ payload }) {
  try {
    const response = yield call(axios.post, '/tokem', payload);
    yield put(actions.loginSuccess({ ...response.data }));
    toast.success('Voce fez login');
    axios.defaults.headers.Authorization = `Bearer ${response.data.tokem}`;
    history.push(payload.prevPath);
  } catch (error) {
    toast.error('Usuario ou senha invalidos');
    yield put(actions.loginFailure());
  }
}
function persistRehydrate({ payload }) {
  const tokem = get(payload, 'auth.tokem');
  if (!tokem) return;
  axios.defaults.headers.Authorization = `Bearer ${tokem}`;
}
// eslint-disable-next-line consistent-return
function* registerRequest({ payload }) {
  const { id, nome, email, password } = payload;

  try {
    if (id) {
      yield call(axios.put, '/membro/', {
        email,
        password: password || undefined,
        nome,
      });
      toast.success('Conta alterado  com sucesso');
      yield put(actions.registerUpdateSuccess({ email, password, nome }));
    } else {
      yield call(axios.post, '/membro/', { nome, password, email });
      toast.success('cadastro realizado com sucesso');
      yield put(actions.regiterCreatedSuccess());

      history.push('/login');
    }
  } catch (error) {
    console.log(error);
    const errors = get(error, 'response.data.erros', []);
    const status = get(error, 'response.status', 0);

    if (status === 401) {
      toast.error('Faça login novamete');
      yield put(actions.loginFailure());
      return history.push('/login');
    }

    if (errors.length) {
      errors.map((es) => toast.error(es));
    } else {
      toast.error('Erro desconhecido');
    }
    return yield put(actions.registerFailure());
  }
}
export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
  takeLatest(types.REGISTER_REQUEST, registerRequest),
]);
