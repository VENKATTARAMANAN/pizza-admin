import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  HStack,
  Heading,
  Icon,
  Image,
  Input,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

const Stock = () => {
  const [pizzadata, setPizzadata] = useState([]);
  const toast = useToast();
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/pizza/all", {
        headers: {
          Authorization: localStorage.getItem("AuthTokenAdmin"),
        },
      });
      setPizzadata(response?.data?.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.data);
    }
  };

  const addQty = async (id) => {
    try {
      const { data } = await axios.put(
        "http://localhost:9000/admin/updatestock",
        { _id: id },{
          headers:{
            Authorization:localStorage.getItem("AuthTokenAdmin")
          }
        }
      );
      getData();
      toast({
        title: data.data,
        status: "success",
        position: "top-right",
        duration: 3500,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data,
        status: "error",
        position: "top-right",
        duration: 3500,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Navbar>
      <Box mt={10} p={8}>
        <Heading
          display={"flex"}
          justifyContent={"center"}
          textDecoration={"underline"}
          fontSize={25}
        >
          Stock
        </Heading>
        <Box
          display={"flex"}
          flexWrap={"wrap"}
          justifyContent={"center"}
          gap={10}
          mt={8}
        >
          {pizzadata.map((val, index) => (
            <Card
              key={index}
              variant="outline"
              mt={3}
              p={5}
              height={"500px"}
              width={{sm:"250",md:"350px", lg:"350px"}}
            >
              <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              mt={5}
            >
              <Image
                objectFit="cover"
                maxW={{ base: "100%", sm: "200px" }}
                src={val.image}
                alt="Caffe Latte"
                width={"200px"}
                height={"200px"}
              />
              </Box>
              <Stack>
                <Box mt={5}>
                  <Heading size="md">{val.name}</Heading>
                  <Box fontSize={13}  width={{base:"150"}}><Text py="2">{val.description}</Text></Box>
                </Box>
                
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <VStack spacing={3}>
                      <Box>
                      <HStack spacing={3}>
                      <Heading fontSize={17}>Stock</Heading>
                      {val.stock >= 20 ? (
                        <Button variant="solid" colorScheme="green">
                          {val.stock}
                        </Button>
                      ) : (
                        <Button variant="solid" colorScheme="red">
                          {val.stock}
                        </Button>
                      )}
                      </HStack>
                      </Box>
                      <Box>
                        <HStack spacing={3}>
                          <Text fontWeight={"bold"} fontSize={17}>
                            UpdateStock
                          </Text>
                          <Button
                            variant="solid"
                            colorScheme="blue"
                            onClick={() => addQty(val._id)}
                          >
                            Add Qty
                          </Button>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
               
              </Stack>
            </Card>
          ))}
        </Box>
      </Box>
    </Navbar>
  );
};

export default Stock;
