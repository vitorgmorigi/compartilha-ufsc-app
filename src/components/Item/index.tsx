import React from "react";
import {
  Container,
  Description,
  Title,
  ProductImage,
  Price,
  Date as DateComponent
} from "./styles";

export type ItemData = {
  id: string;
  createdBy: string;
  circle: string;
  createdAt: Date;
  expirationDate: Date;
  name: string;
  image: string;
}


export function Item(props: ItemData) {
  return <Container>
  <ProductImage source={{ uri: props.image }} />
  <Description>
    <Title>{props.name}</Title>
    <Price>{props.circle}</Price>
    <DateComponent>{new Date(props.createdAt).toLocaleString()}</DateComponent>
  </Description>
</Container>
}