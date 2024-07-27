import React from 'react';
import { Link } from 'react-router-dom';

import { Container, Menu, MenuItem } from './styles';

const Header: React.FC = () => {
  return (
    <Container>
      <Menu>
        <MenuItem>
          <Link to='/'>Listar médicos</Link>
        </MenuItem>
        <MenuItem>
          <Link to='/register'>Cadastar médicos</Link>
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Header;
