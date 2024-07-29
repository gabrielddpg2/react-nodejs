import React, { useEffect, useState } from 'react';
import api from '../../services/api';  
import { Container, Header, WorkTime, Button, History } from './styles';

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

  useEffect(() => {
    if (userCode) {
      api.get(`/points/today/${userCode}`).then(response => {
        setWorkTime(response.data);
      });

      api.get(`/points/history/${userCode}`).then(response => {
        setHistory(response.data);
      });
    }
  }, [userCode]);

  const handleExit = async () => {
    if (userCode) {
      try {
        await api.post('/points', { user_code: userCode });
        // Refresh the data
        const response = await api.get(`/points/today/${userCode}`);
        setWorkTime(response.data);
      } catch (error) {
        console.error('Erro ao registrar a hora de saída:', error);
      }
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <h1>Relógio de ponto</h1>
          <span>{userCode}</span>
        </div>
        <Button onClick={handleExit}>Hora de saída</Button>
      </Header>
      <WorkTime>
        <h2>{workTime ? `${workTime.hours}h ${workTime.minutes}m` : '0h 0m'}</h2>
        <p>Horas de hoje</p>
      </WorkTime>
      <History>
        <h3>Dias anteriores</h3>
        {history.map(item => (
          <div key={item.id}>
            <span>{item.date}</span>
            <span>{item.hours}h {item.minutes}m</span>
          </div>
        ))}
      </History>
    </Container>
  );
};

export default Pontos;
