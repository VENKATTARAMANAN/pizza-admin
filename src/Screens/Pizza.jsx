import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { url } from "../config/api";

const Pizza = () => {
  const navigate = useNavigate();
  const [pizzadata, setPizzadata] = useState([]);
  const [deleteid, setDeleteId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();
  const getData = async () => {
    try {
      const response = await axios.get(`${url}/pizza/all`, {
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

  const deletePizza = async () => {
    try {
      const { data } = await axios.delete(
        `${url}/admin/deletepizza/${deleteid}`,
        {
          headers: {
            Authorization: localStorage.getItem("AuthTokenAdmin"),
          },
        }
      );
      getData();
      toast({
        title: data.data.sta,
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
    onClose();
    setDeleteId("");
  };

  const modalOpen = (id) => {
    onOpen();
    setDeleteId(id);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Navbar>
      <Box mt={12} pt={10} display={"flex"} justifyContent={"center"}>
        <VStack spacing={3}>
          <Heading
            display={"flex"}
            justifyContent={"center"}
            textDecoration={"underline"}
            fontSize={25}
          >
            Available Pizza List
          </Heading>

          <Button
            mt={5}
            variant={"none"}
            bg={"rgb(251, 197, 60)"}
            onClick={() => navigate("/addpizza")}
          >
            Add Pizza
          </Button>
        </VStack>
      </Box>
      <Box
        display={"flex"}
        flexWrap={"wrap"}
        justifyContent={"center"}
        gap={10}
        mt={8}
      >
        {pizzadata.map((val, index) => (
          <Card key={index} height={"350px"} width={"350px"}>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              mt={5}
            >
              <Image
                src={val.image}
                alt={val.name}
                borderRadius="lg"
                width={"200px"}
                height={"200px"}
              />
            </Box>
            <Stack mt={3} spacing={3}>
              <Heading display={"flex"} justifyContent={"center"} size={"md"}>
                {val.name}
              </Heading>
              <Box display={"flex"} justifyContent={"center"} mt={5}>
                <HStack spacing={10}>
                  <Tooltip hasArrow label="Delete" fontSize="md">
                    <Icon
                      as={DeleteIcon}
                      w={8}
                      h={8}
                      color="red.500"
                      cursor={"pointer"}
                      onClick={() => modalOpen(val._id)}
                    />
                  </Tooltip>
                  <Tooltip hasArrow label="Edit" fontSize="md">
                    <Icon
                      as={EditIcon}
                      w={8}
                      h={8}
                      color="red.500"
                      cursor={"pointer"}
                      onClick={() => navigate(`/editpizza/${val._id}`)}
                    />
                  </Tooltip>
                </HStack>
              </Box>
            </Stack>
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Pizza
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button
                      ref={cancelRef}
                      onClick={() => (onClose(), setDeleteId(""))}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => deletePizza()}
                      ml={3}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Card>
        ))}
      </Box>
    </Navbar>
  );
};

export default Pizza;
