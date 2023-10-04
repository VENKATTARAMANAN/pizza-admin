import React from "react";
import pizzaicon from "../assets/pizza_mania.png";
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Image,
  Input,
  Stack,
  background,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate=useNavigate();
  const { values, handleSubmit, handleChange, handleBlur } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          "http://localhost:9000/admin/adminlogin",
          values
        );
        if(data.data.statuscode === 200){
          localStorage.setItem("AuthTokenAdmin",data.data.token)
          navigate("/orders")
        }
      } catch (error) {
        console.log(error);
        alert(error?.response?.data?.data);
      }
    },
  });
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      height={"100vh"}
    >
      <Container
        backgroundColor={"white"}
        boxShadow={{ base: "none", sm: "lg" }}
        py={{ base: "0", sm: "8" }}
        px={{ base: "0", sm: "10" }}
        borderRadius={{ base: "none", sm: "xl" }}
        maxW="lg"
        width={{ base: "100%", sm: "75%", md: "100%" }}
      >
        <Center>
          <Image
            src={pizzaicon}
            alt="logo"
            style={{ width: "100px", height: "100px" }}
          />
        </Center>

        <Center fontSize={20} fontWeight={"bold"}>
          ADMIN LOGIN
        </Center>
        <Box>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel htmlFor="email" fontSize={17}>
                Email
              </FormLabel>
              <Input
                required
                height="40px"
                id="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                value={values.email}
                name="email"
              />
              <FormLabel mt={2} htmlFor="password" fontSize={17}>
                Password
              </FormLabel>
              <Input
                required
                height="40px"
                id="password"
                type="Password"
                placeholder="password"
                onChange={handleChange}
                value={values.password}
                name="password"
              />
            </FormControl>
            <Center mt={"6"}>
              <Button colorScheme="blue" type="submit">
                Sign in
              </Button>
            </Center>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
