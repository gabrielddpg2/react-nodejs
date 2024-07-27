import React, { useCallback, useEffect, useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';

import Header from '../../components/Header';

import { Container, TableContainer } from './styles';
import { toast } from 'react-toastify';

interface IDoctor {
  id: string;
  name: string;
  crm: string;
  phone_number: string;
  cellphone_number: string;
  cep: string;
  street: string;
  state: string;
  city: string;
}

interface IDoctorState {
  doctor: IDoctor;
  specialties: string[];
}

const Home: React.FC = () => {
  const [doctors, setDoctors] = useState<IDoctorState[]>([]);

  const history = useHistory();

  const loadDoctors = useCallback(async () => {
    const response = await api.get('/doctors');

    setDoctors(response.data);
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const handleRemoveDoctor = useCallback(
    async (id: string) => {
      try {
        await api.delete(`doctors/${id}`);
        toast.success('Cadastro excluído com sucesso');
        loadDoctors();
      } catch (err) {
        toast.success(
          'Ocorreu um erro ao deletar cadastro, tente novamente mais tarde.'
        );
      }
    },
    [loadDoctors]
  );

  const handleEditDoctor = useCallback(
    (id: string) => {
      history.push({ pathname: `/edit/${id}`, state: { id } });
    },
    [history]
  );

  return (
    <Container>
      <Header />
      <TableContainer>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CRM</th>
              <th>Estado</th>
              <th>Cidade</th>
              <th>Especialidades:</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {doctors?.map((user) => (
              <tr key={user.doctor.id}>
                <td>{user.doctor.name}</td>
                <td>{user.doctor.crm}</td>
                <td>{user.doctor.state}</td>
                <td>{user.doctor.city}</td>
                <td>
                  {user.specialties.map((specialty) => (
                    <li key={specialty}>{specialty}</li>
                  ))}
                </td>
                <td className='user-actions'>
                  <button
                    type='button'
                    onClick={() => handleEditDoctor(user.doctor.id)}
                  >
                    <FiEdit size={20} color='#3bafda' />
                  </button>
                  <button
                    type='button'
                    onClick={() => handleRemoveDoctor(user.doctor.id)}
                  >
                    <FiTrash2 size={20} color='#ff4b5b' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>
    </Container>
  );
};

export default Home;
