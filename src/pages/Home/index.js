import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import {
  FaUserCircle,
  FaEdit,
  FaWindowClose,
  FaExclamation,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Container } from '../../styles/GlobalStyles';
import { AlunoConteiner, NovoAluno, ProfilePicture } from './styled';

import axios from '../../services/axios';
import Loading from '../../components/Loading';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Loading isLoading={isLoading} />
      <Container>
        <h1>Alunos</h1>
      </Container>
    </>
  );
}
