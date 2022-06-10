import React from 'react';
import styled from 'styled-components';
import Icon from '../../../icons';

const PlusIcon: React.FC = () => {
  return (
    <Container>
      <Icon.Plus color={'#3F2D28'} width={24} height={24} />
    </Container>
  );
};

export default PlusIcon;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: 2px solid #3f2d28;
  border-radius: 5px;
`;
