import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentPath } from "../utils/selectors";
import { Box, Image as ChakraImage, Text } from "@chakra-ui/react";

const PHOTO_URL = "http://192.168.1.130:8080"

export default function Image({ image }) {
  const currentPath = useSelector(selectCurrentPath);

  return (
    <Box
    mt={1}
        height={'fit-content'}
    >
      <ChakraImage
        maxH={"150px"}
        m={'auto'}
        maxW={'100px'}
        border={'2px'}
        borderColor={'grey'}
        padding={'4px'}
        borderRadius={'4px'}
        cursor={'pointer'}
        src={`${PHOTO_URL}${currentPath}/${image}`}
      />
      <Text align={'center'} color={'whiteAlpha.900'}>Image Name</Text>
    </Box>
  );
}
