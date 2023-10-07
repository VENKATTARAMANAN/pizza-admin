import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import {
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { url } from "../config/api";

const addPizzaValidation = yup.object({
  name: yup
    .string()
    .required("Please Enter Name")
    .min(5, "Please Enter min 5 Characters")
    .max(30, "Maximum 25 Character Allowed"),
  description: yup
    .string()
    .required("Please Enter Description")
    .min(10, "Minimum 10 characters required")
    .max(200, "Maximum 200 Character Allowed"),
});

const EditPizza = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [image, setImage] = useState("");
  const [regular, setRegular] = useState("");
  const [medium, setMedium] = useState("");
  const [large, setLarge] = useState("");
  const [imageerror, setImageError] = useState("");

  const getData = async () => {
    try {
      const { data } = await axios.get(
        `${url}/admin/editpizza/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("AuthTokenAdmin"),
          },
        }
      );
      setValues(data.data.dat);
    } catch (error) {
      console.log(error);
    }
  };

  const { values,errors,touched, handleSubmit, handleChange, setValues,handleBlur } = useFormik({
    initialValues: {
      name: "",
      image: "",
      description: "",
      prices: [],
      regular: "",
      medium: "",
      large: "",
    },
    validationSchema: addPizzaValidation,
    onSubmit: async () => {
      try {
        if (imageerror === "Invalid file format") {
          toast({
            title: "Please select JPEG or PNG file format",
            status: "error",
            position: "top-right",
            duration: 3500,
            isClosable: true,
          });
        } else {
          if (image !== "") {
            values.image = image;
          }
          values.prices = [
            {
              regular: parseInt(regular),
              medium: parseInt(medium),
              large: +large,
            },
          ];
          delete values._id;
          delete (values._id, values.regular, values.medium, values.large);
          const { data, status } = await axios.put(
            `${url}/admin/editpizzadata`,
            values,
            {
              headers: {
                Authorization: localStorage.getItem("AuthTokenAdmin"),
              },
            }
          );
          if (status === 200) {
            toast({
              title: data.data,
              status: "success",
              position: "top-right",
              duration: 3500,
              isClosable: true,
            });
            navigate("/pizza");
          }
        }
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
    },
  });
  useEffect(() => {
    if (values.prices) {
      values.prices.map((val) => {
        setRegular(val.regular);
        setMedium(val.medium);
        setLarge(val.large);
      });
    }
  }, [values.prices]);

  const handleChangeImage = async (img) => {
    try {
      if (img.type === "image/jpeg" || img.type === "image/png") {
        const formData = new FormData();
        formData.append("file", img);
        formData.append("upload_preset", "hlg8sh4a");
        let data = "";
        await axios
          .post(
            "https://api.cloudinary.com/v1_1/dsibhutxu/image/upload",
            formData
          )
          .then((response) => {
            data = response.data["secure_url"];
            setImage(data);
            setImageError("");
          });
        return data;
      } else {
        setImageError("Invalid file format");
        toast({
          title: "Invalid file format",
          status: "error",
          position: "top-right",
          duration: 3500,
          isClosable: true,
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Navbar>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        mt={20}
      >
        <Card p={10} width={{ lg: "500px", md: "500px" }}>
          <CardHeader display={"flex"} justifyContent={"center"}>
            <Heading size="md">Edit Pizza</Heading>
          </CardHeader>
          <Box>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Name"
                  size="lg"
                  name="name"
                  value={values.name}
                  id="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.name && touched.name ? (
                  <span className="errrorText">{errors.name}</span>
                ) : (
                  <></>
                )}
                <FormLabel>Image</FormLabel>
                <Input
                  placeholder="Image"
                  size="lg"
                  type="file"
                  onChange={(e) => handleChangeImage(e.target.files[0])}
                />
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Description"
                  size="lg"
                  name="description"
                  id="description"
                  onChange={handleChange}
                  value={values.description}
                  onBlur={handleBlur}
                />
                {errors.description && touched.description ? (
                  <span className="errrorText">{errors.description}</span>
                ) : (
                  <></>
                )}
                <FormLabel>Price</FormLabel>
                <FormLabel>Regular</FormLabel>
                <Input
                  id="regular"
                  name="regular"
                  value={regular}
                  type="number"
                  onChange={(e) => setRegular(e.target.value)}
                />
                <FormLabel>Medium</FormLabel>
                <Input
                  id="medium"
                  name="medium"
                  value={medium}
                  type="number"
                  onChange={(e) => setMedium(e.target.value)}
                />
                <FormLabel>Large</FormLabel>
                <Input
                  id="large"
                  name="large"
                  type="number"
                  value={large}
                  onChange={(e) => setLarge(e.target.value)}
                />
              </FormControl>
              <Box mt={5} display={"flex"} justifyContent={"center"}>
                <Button variant={"none"} bg={"rgb(251, 197, 60)"} type="submit">
                  Edit Pizza
                </Button>
              </Box>
            </form>
          </Box>
        </Card>
      </Box>
    </Navbar>
  );
};

export default EditPizza;
