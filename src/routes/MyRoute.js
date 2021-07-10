/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function MyRoute({
  component: Component,
  idFuncao,
  usuarioPermitido,
  isClosed,
  ...rest
}) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  let permitido = false;

  if (isClosed && !isLoggedIn) {
    return (
      <Redirect
        to={{ pathname: '/login', state: { prevPath: rest.location.pathname } }}
      />
    );
  }
  if (isClosed) {
    usuarioPermitido.map((dado) => {
      if (dado.id === idFuncao) {
        permitido = true;
      }
      return permitido;
    });
    if (!permitido) {
      toast.error(
        'Desculpe mais você não possui permissão para acessar essa aba'
      );
      return (
        <Redirect
          to={{
            pathname: '/login',
            state: { prevPath: rest.location.pathname },
          }}
        />
      );
    }
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Route {...rest} component={Component} />;
}

MyRoute.defaultProps = {
  isClosed: false,
  idFuncao: 0,
  usuarioPermitido: [],
};

MyRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  isClosed: PropTypes.bool,
  idFuncao: PropTypes.number,
  usuarioPermitido: PropTypes.array,
};
