import styled from "styled-components/native";

export const Container = styled.View`
  background: #fff;
  width: 100%;
  shadow-color: #000;
  shadow-offset: 0 0;
  shadow-opacity: 0.2;
  shadow-radius: 10.0;
  elevation: 3;
  border: 1px solid #ddd;
  flex-direction: row;
  margin-bottom: 10px;
  border-radius: 5.0;
`;

export const ProductImage = styled.Image`
  width: 280px;
  height: 280px;
  resize-mode: stretch;
`;