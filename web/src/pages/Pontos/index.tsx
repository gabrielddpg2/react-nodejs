import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { HourContainer, Container, Header, WorkTime, Button, History } from './styles';

interface IWorkTime {
  hours: string;
  minutes: string;
  trabalhando: boolean;
}

interface IHistoryItem {
  id: string;
  date: string;
  hours: number;
  minutes: number;
}

const Pontos: React.FC = () => {
  const [workTime, setWorkTime] = useState<IWorkTime | null>(null);
  const [history, setHistory] = useState<IHistoryItem[]>([]);
  const userCode = localStorage.getItem('session');

  const fetchWorkTime = async () => {
    if (userCode) {
      const response = await api.get(`/points/today/${userCode}`);
      setWorkTime(response.data);
    }
  };

  const fetchHistory = async () => {
    if (userCode) {
      const response = await api.get(`/points/history/${userCode}`);
      setHistory(response.data);
    }
  };

  useEffect(() => {
    fetchWorkTime();
    fetchHistory();
  }, [userCode]);

  const handleButtonClick = async () => {
    if (userCode) {
      try {
        await api.post('/points', { user_code: userCode });
        await fetchWorkTime();
        await fetchHistory();
      } catch (error) {
        console.error('Erro ao registrar a hora:', error);
      }
    }
  };

  return (
    <Container>
      <HourContainer>
        <Header>
          <div className='headerMain'>
            <h1>Relógio de ponto</h1>
            <div>
              <div className='userCode'>#{userCode}</div>
              <div>Usuário</div>
            </div>
          </div>

        </Header>
        <WorkTime>
          <h2>{workTime ? `${workTime.hours}h ${workTime.minutes}m` : '0h 0m'}</h2>
          <p>Horas de hoje</p>
        </WorkTime>
        <Button onClick={handleButtonClick}>
          {workTime?.trabalhando ? 'Hora de entrada' : 'Hora de saída'}
        </Button>
        <History>
          <h3>Dias anteriores</h3>
          {history.map(item => (
            <div key={item.id}>
              <span>{item.date}</span>
              <span>{item.hours}h {item.minutes}m</span>
            </div>
          ))}
        </History>
      </HourContainer>
    </Container>
  );
};

export default Pontos;
