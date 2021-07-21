import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Container } from '../../styles/GlobalStyles';

import Loading from '../../components/Loading';
import Card from '../../components/Card';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const storage = useSelector((state) => state.auth);
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      console.log(storage.user);
      setIsLoading(false);
    }
    getData();
  }, []);
  return (
    <>
      <Loading isLoading={isLoading} />
      <Container>
        <h1>Seja bem vindo {storage.user.nome}</h1>
        <Card />
      </Container>
    </>
  );
}
