import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';  // Importando a instância configurada
import { Container, InputContainer, Button } from './styles';

const Login: React.FC = () => {
  const [userCode, setUserCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserCode(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await api.get(`/users/exists/${userCode}`);

      if (response.data.exists) {
        window.location.href = 'https://www.google.com';
      } else {
        setErrorMessage('Esse usuário não está cadastrado no sistema.');
      }
    } catch (error) {
      setErrorMessage('Erro ao verificar o usuário. Tente novamente mais tarde.');
    }
  };

  return (
    <Container>
      <InputContainer>
        <h1>Ponto</h1>
        <div className='divInput'>
          <span>Código do usuário</span>
          <input
            type="text"
            placeholder=""
            value={userCode}
            onChange={handleInputChange}
          />
        </div>
        <Button onClick={handleSubmit}>Confirmar</Button>
      </InputContainer>
      {errorMessage && <p>{errorMessage}</p>}
    </Container>
  );
};

export default Login;
