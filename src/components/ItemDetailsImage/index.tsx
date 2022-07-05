import React from "react";
import {
  Container,
  ProductImage,
} from "./styles";

export type ItemDetailsImageData = {
  uri: string
}

export function ItemDetailsImage(props: ItemDetailsImageData) {
  return <Container>
  <ProductImage source={{ uri: props.uri }} />
</Container>
}