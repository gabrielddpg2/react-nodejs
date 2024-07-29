import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #1c1c1c;
  height: 100vh;
  color: #fff;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;

  div {
    display: flex;
    flex-direction: column;

    h1 {
      margin: 0;
      font-family: Montserrat;
      font-size: 21.52px;
      font-weight: 400;
      line-height: 26.23px;
    }

    span {
      font-family: Montserrat;
      font-size: 14px;
      font-weight: 300;
      line-height: 17.07px;
    }
  }
`;

export const WorkTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 48px;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 14px;
    font-weight: 300;
    line-height: 17.07px;
  }
`;

export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #ff8c00;
  color: #fff;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const History = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  h3 {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 400;
  }

  div {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    background-color: #2c2c2c;
    margin-bottom: 10px;
    border-radius: 4px;

    span {
      font-size: 16px;
    }
  }
`;
