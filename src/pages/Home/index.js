import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Button, Card, CardGroup, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MdArrowBack, MdSchool } from 'react-icons/md';
import Image from 'react-bootstrap/Image';
import Carrosel from '../../components/Carrosel';

import Loading from '../../components/Loading';
import history from '../../services/history';
import { ContainerBox, Container } from './styled';

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

  const Background =
    'https://scontent.fsjp11-1.fna.fbcdn.net/v/t1.6435-9/160623839_2582889168678641_2023677560455990448_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=e3f864&_nc_ohc=VXdbgUjiTmUAX8Mlmw2&_nc_ht=scontent.fsjp11-1.fna&oh=021388397c918663258084b1b7f0bb4d&oe=6151FAD3';

  const pioneiros =
    'https://www.adfabricianoipatinga.com.br/img/noticias/bI1GDdaniel_e_gunnar.jpg';

  const biblia =
    'https://i2.wp.com/www.oracaoefe.com.br/wp-content/uploads/biblia-online.jpg?resize=750%2C410&quality=100&ssl=1&quality=100';
  const congregacao =
    'https://scontent.fsjp11-1.fna.fbcdn.net/v/t31.18172-8/27747665_1807707642863468_3436755833745335617_o.jpg?_nc_cat=111&ccb=1-5&_nc_sid=e3f864&_nc_ohc=_QQComn_CqIAX_FirH1&_nc_ht=scontent.fsjp11-1.fna&oh=db3e494a220fc5aac2ad3ddb5c254649&oe=6151C549';
  return (
    <>
      <Loading isLoading={isLoading} />

      <Image src={Background} fluid />
      <Container>
        <ContainerBox>
          <h2>Quem somos nós?</h2>
        </ContainerBox>
        <CardGroup>
          <Card style={{ padding: 10, borderRadius: 25, marginRight: 5 }}>
            <Card.Img
              variant="top"
              src={pioneiros}
              style={{ height: 250, borderRadius: 25 }}
            />
            <Card.Body>
              <Card.Title>Nossa História</Card.Title>
              <Card.Text>
                A Assembleia de Deus chegou ao Brasil por intermédio dos
                missionários suecos Gunnar Vingren e Daniel Berg, que aportaram
                em Belém, capital do Estado do Pará, em 19 de novembro de 1910
              </Card.Text>
            </Card.Body>
            <Card.Footer style={{ background: '#fff' }}>
              <button type="button">Saiba mais...</button>
            </Card.Footer>
          </Card>
          <Card style={{ padding: 10, borderRadius: 25 }}>
            <Card.Img
              variant="top"
              src={biblia}
              style={{ height: 250, borderRadius: 25 }}
            />
            <Card.Body>
              <Card.Title>O que cremos</Card.Title>
              <Card.Text>
                <strong>1.</strong> Em um só Deus, eternamente subsistente em
                três pessoas: o Pai, o Filho e o Espírito Santo (Dt 6.4; Mt
                28.19; Mc 12.29).
                <br />
                <strong>2.</strong> Na inspiração verbal da Bíblia Sagrada,
                única regra infalível de fé normativa para o caráter cristão (2ª
                Tm 3.14-17).
              </Card.Text>
            </Card.Body>
            <Card.Footer style={{ background: '#fff' }}>
              <button type="button">Saiba mais...</button>
            </Card.Footer>
          </Card>
          <Card
            style={{
              padding: 10,
              marginLeft: 5,
              borderRadius: 25,
            }}
          >
            <Card.Img
              variant="top"
              src={congregacao}
              style={{ height: 250, borderRadius: 25 }}
            />
            <Card.Body>
              <Card.Title>Congregações</Card.Title>
              <Card.Text>
                Atualmente possuimos 5 templos
                <li>Sede</li>
                <li>Campo Belo</li>
                <li>Menina Moça</li>
                <li>São José</li>
                <li>Cachoeirinha</li>
              </Card.Text>
            </Card.Body>
            <Card.Footer style={{ background: '#fff' }}>
              <button type="button">Saiba mais...</button>
            </Card.Footer>
          </Card>
        </CardGroup>
        <Row style={{ marginTop: 10 }}>
          <Col md={6} sm={12}>
            <iframe
              width="100%"
              height="300"
              src="https://www.youtube.com/embed/GFf_0IJq20Q"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Col>
        </Row>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14926.069631303086!2d-48.9149794!3d-20.7298126!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xef31f10fd1cb582f!2sAssembleia%20de%20Deus%20Min.%20Bel%C3%A9m%20-%20Ol%C3%ADmpia!5e0!3m2!1spt-BR!2sbr!4v1630373912770!5m2!1spt-BR!2sbr"
          width="600"
          height="450"
          title="Localização do templo sede"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
      </Container>
    </>
  );
}
