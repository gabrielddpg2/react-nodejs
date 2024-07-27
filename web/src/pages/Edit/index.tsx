import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Header from '../../components/Header';

import { Container, Form, Input, InputMask, Button } from './styles';
import api from '../../services/api';
import { useHistory, useRouteMatch } from 'react-router-dom';

interface ViaCepResponse {
  bairro: string;
  cep: string;
  complemento: string;
  ddd: string;
  gia: string;
  ibge: string;
  localidade: string;
  logradouro: string;
  siafi: string;
  uf: string;
}

interface DoctorParams {
  id: string;
}

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

const Edit: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [crm, setCrm] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [cellphoneNumber, setCellphoneNumber] = useState<string>('');
  const [zipcode, setZipcode] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const history = useHistory();
  const { params } = useRouteMatch<DoctorParams>();

  useEffect(() => {
    api.get<IDoctorState>(`doctors/${params.id}`).then((response) => {
      const {
        name,
        crm,
        cep,
        cellphone_number,
        city,
        phone_number,
        state,
        street,
      } = response.data.doctor;
      setName(name);
      setCrm(crm);
      setZipcode(cep);
      setCellphoneNumber(cellphone_number);
      setCity(city);
      setPhoneNumber(phone_number);
      setState(state);
      setStreet(street);
      setSelectedItems(response.data.specialties);
    });
  }, [
    setName,
    setCrm,
    setPhoneNumber,
    setCellphoneNumber,
    setZipcode,
    setStreet,
    setCity,
    setState,
    setSelectedItems,
    params.id,
  ]);

  const handleAssignCEP = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      try {
        const parsedZipcode = event.target.value.replace('-', '').trim();

        if (parsedZipcode.length <= 7) {
          return;
        }

        const response = await axios.get<ViaCepResponse>(
          `https://viacep.com.br/ws/${parsedZipcode}/json/`
        );

        if (response.data.cep) {
          setZipcode(response.data.cep);
          setCity(response.data.localidade);
          setState(response.data.uf);
          setStreet(response.data.logradouro);
        } else {
          toast.error('CEP não encontrado.');
        }
      } catch (err) {
        const e = new ErrorEvent('error', {
          message: 'my error',
        });
        window.dispatchEvent(e);
      }
    },
    []
  );

  const handleSelectSpecialty = useCallback(
    (specialty) => {
      const alreadySelected = selectedItems.findIndex(
        (item) => item === specialty
      );

      if (alreadySelected >= 0) {
        const filteredItems = selectedItems.filter(
          (item) => item !== specialty
        );

        setSelectedItems(filteredItems);
      } else {
        setSelectedItems([...selectedItems, specialty]);
      }
    },
    [selectedItems]
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event?.preventDefault();

      const data = {
        name,
        crm,
        phone_number: phoneNumber,
        cellphone_number: cellphoneNumber,
        cep: zipcode.replace('-', '').trim(),
        street,
        state,
        city,
        specialties: selectedItems,
      };

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        crm: Yup.string().required('CRM é obrigatório'),
        phone_number: Yup.string(),
        cellphone_number: Yup.string().required(
          'Número de celular é obrigatório'
        ),
        cep: Yup.string().required('CEP é obrigatório'),
        street: Yup.string().required('Rua é obrigatório'),
        state: Yup.string().required('Estado é obrigatório'),
        city: Yup.string().required('Cidade é obrigatório'),
        specialties: Yup.array()
          .min(2)
          .max(8)
          .required('Ao menos duas especialidades é obrigatória'),
      });

      const valid = await schema.isValid(data);

      if (!valid) {
        toast.error('Existem campo(s) inválidos, verificar novamente...');
        return;
      }

      await api.put(`doctors/${params.id}`, {
        ...data,
        specialties: selectedItems.join(', '),
      });

      toast.success('Dados atualizados com sucesso!');

      history.push('/');
    },
    [
      name,
      crm,
      phoneNumber,
      cellphoneNumber,
      zipcode,
      street,
      state,
      city,
      selectedItems,
      history,
      params.id,
    ]
  );

  return (
    <>
      <Header />
      <Container>
        <Form onSubmit={handleSubmit}>
          <h2>Atualizar dados do Doutor(a): {name}</h2>
          <Input
            placeholder='Nome do médico'
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
          <InputMask
            placeholder='CRM'
            format='##.###.##'
            value={crm}
            onChange={(e: any) => setCrm(e.target.value)}
          />
          <InputMask
            placeholder='Telefone Fixo'
            format='(##) ####-####'
            value={phoneNumber}
            onChange={(e: any) => setPhoneNumber(e.target.value)}
          />
          <InputMask
            placeholder='Telefone Celular'
            format='(##) #####-####'
            value={cellphoneNumber}
            onChange={(e: any) => setCellphoneNumber(e.target.value)}
          />
          <InputMask
            placeholder='CEP'
            format='#####-###'
            onChange={handleAssignCEP}
            value={zipcode}
          />
          <Input
            placeholder='UF'
            value={state}
            onChange={(e: any) => setState(e.target.value)}
          />
          <Input
            placeholder='Cidade'
            value={city}
            onChange={(e: any) => setCity(e.target.value)}
          />
          <Input
            placeholder='Rua'
            value={street}
            onChange={(e: any) => setStreet(e.target.value)}
          />
          <fieldset>
            <legend>
              <h2>Especialidades</h2>
              <span>Selecione duas ou mais especialidades abaixo</span>
            </legend>

            <ul className='items-grid'>
              {specialtiesAvailable.map((item) => (
                <li
                  key={item}
                  onClick={() => handleSelectSpecialty(item)}
                  className={selectedItems.includes(item) ? 'selected' : ''}
                >
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </fieldset>

          <Button type='submit'>Atualizar</Button>
        </Form>
      </Container>
    </>
  );
};

export default Edit;

const specialtiesAvailable = [
  'ALERGOLOGIA',
  'ANGIOLOGIA',
  'BUCO MAXILO',
  'CARDIOLOGIA CLÍNICA',
  'CARDIOLOGIA INFANTIL',
  'CIRURGIA CABEÇA E PESCOÇO',
  'CIRURGIA CARDÍACA',
  'CIRURGIA DE TÓRAX',
];
