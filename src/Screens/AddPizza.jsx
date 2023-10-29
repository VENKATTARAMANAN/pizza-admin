import React, { useState } from "react";
import Navbar from "./Navbar";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { url } from "../config/api";

const addPizzaValidation = yup.object({
  name: yup
    .string()
    .required("Please Enter Name")
    .min(5, "Please Enter min 5 Characters")
    .max(35, "Maximum 35 Character Allowed"),
  description: yup
    .string()
    .required("Please Enter Description")
    .min(10, "Minimum 10 characters required")
    .max(200, "Maximum 200 Character Allowed"),
  stock: yup
    .number()
    .required("Please Enter Stock")
    .min(1, "Please Enter minimum 1 stock")
    .max(100000, "Maximum 1,00,000 Stock Allowed").positive().integer(),
});

const AddPizza = () => {
  const toast = useToast();
  const navigate=useNavigate();
  const [checkedOne, setCheckedOne] = useState(false);
  const [regular, setRegular] = useState("");
  const [checkedTwo, setCheckedTwo] = useState(false);
  const [medium, setMedium] = useState("");
  const [checkedThree, setCheckedThree] = useState(false);
  const [large, setLarge] = useState("");
  const [image, setImage] = useState(" ");
  const [imageerror,setImageError]=useState("");

  const { values, errors, handleSubmit, handleChange, touched, handleBlur } =
    useFormik({
      initialValues: {
        name: "",
        description: "",
        stock: "",
      },
      validationSchema: addPizzaValidation,
      onSubmit: async () => {
        try {
          let price = {};
          let varient = [];
          if (regular != "") {
            price = { ...price, regular: +regular };
            varient.push("regular");
          }
          if (medium != "") {
            price = { ...price, medium: +medium };
            varient.push("medium");
          }
          if (large != "") {
            price = { ...price, large: +large };
            varient.push("large");
          }

          let value = {
            name: values.name,
            image: image,
            description: values.description,
            prices: [price],
            varients: varient,
            pizzabase: [
              "New_Hand_Tossed",
              "Cheese_Burst",
              "Classic_Hand_Tossed",
              "Fresh_Pan_Pizza",
              "Wheat_Thin_Crust",
            ],
            sauce: [
              "Spicy_Red_Sauce",
              "BBQ_Sauce",
              "plain_tomato_sauce",
              "Marinara_sauce",
              "Pesto_Sauce",
            ],
            cheese: [
              "Mozzarella_Cheese",
              "Cheddar_Cheese",
              "Parmesan_Cheese",
              "Ricotta_Cheese",
            ],
            vegtoppings: [
              "Grilled_Mushrooms",
              "Onion",
              "Fresh_Tomato",
              "Jalapeno",
              "Black_Olive",
            ],
            nonvegtoppings: [
              "Pepper_Barbecue_chicken",
              "Peri-Peri chicken",
              "Grilled chicken Rasher",
              "Chicken Tikka",
            ],
            category: "veg",
            deleteflag: false,
            stock: values.stock,
          };
          if(imageerror === "Invalid file format"){
            toast({
                  title:"Please select JPEG or PNG file format",
                  status: "error",
                  position: "top-right",
                  duration: 3500,
                  isClosable: true,
                })
          }  
          else{
            const {data,status}=await axios.post(`${url}/admin/addnewpizza`,value,
      {
        headers:{
          Authorization:localStorage.getItem("AuthTokenAdmin")
        }
      }
      )
      if(status === 200){
        toast({
          title: data.data,
          status: "success",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
        navigate("/pizza")
      }
      console.log(value);
          }
        } catch (error) {
          console.log("error::: ", error);
        }
      },
    });

  const handleChangeOne = () => {
    setCheckedOne(!checkedOne);
    if (checkedOne != "true") {
      setRegular("");
    }
  };

  const handleChangeTwo = () => {
    setCheckedTwo(!checkedTwo);
    if (checkedTwo != "true") {
      setMedium("");
    }
  };

  const handleChangeThree = () => {
    setCheckedThree(!checkedThree);
    if (checkedThree != "true") {
      setLarge("");
    }
  };

  const handleImage = async (img) => {
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
            setImageError("")
          });
        return data;
      } else {
        setImageError("Invalid file format")
        toast({
          title: "Please select JPEG or PNG file format",
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

  return (
    <Navbar>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        mt={20}
      >
        <Card p={10} width={{ lg: "500px", md: "500px" }}>
          <CardHeader>
            <Heading size="md" display={"flex"} justifyContent={"center"}>
              Add New Pizza
            </Heading>
          </CardHeader>
          <Box>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Name"
                  id="name"
                  value={values.name}
                  onChange={handleChange}
                  name="name"
                  onBlur={handleBlur}
                />
                {errors.name && touched.name ? (
                  <span className="errrorText">{errors.name}</span>
                ) : (
                  <></>
                )}
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Image</FormLabel>
                <Input
                  placeholder="Image"
                  size="lg"
                  type="file"
                  onChange={(e) => handleImage(e.target.files[0])}
                  name="image"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  id="description"
                  value={values.description}
                  onChange={handleChange}
                  name="description"
                  required
                  onBlur={handleBlur}
                />
                {errors.description && touched.description ? (
                  <span className="errrorText">{errors.description}</span>
                ) : (
                  <></>
                )}
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Add Stock</FormLabel>
                <Input
                  id="stock"
                  value={values.stock}
                  onChange={handleChange}
                  name="stock"
                  required
                  type="number"
                  onBlur={handleBlur}
                />
                {errors.stock && touched.stock ? (
                  <span className="errrorText">{errors.stock}</span>
                ) : (
                  <></>
                )}
              </FormControl>
              <FormLabel>Select Size</FormLabel>

              <VStack spacing={3} display={"flex"} justifyContent={"left"}>
                <Box>
                  <HStack spacing={3}>
                    <Checkbox
                      required
                      value={checkedOne}
                      onChange={handleChangeOne}
                    >
                      Regular
                    </Checkbox>
                    {checkedOne ? (
                      <Input
                        value={regular}
                        onChange={(e) => setRegular(e.target.value)}
                        placeholder="Price"
                        required
                        type="number"
                        max="100000"
                        min="1"
                      />
                    ) : (
                      <></>
                    )}
                  </HStack>
                </Box>
                <Box>
                  <HStack spacing={3}>
                    <Checkbox  required value={checkedTwo} onChange={handleChangeTwo}>
                      Medium
                    </Checkbox>
                    {checkedTwo ? (
                      <Input
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        placeholder="Price"
                        required
                        type="number"
                        max="100000"
                        min="1"
                      />
                    ) : (
                      <></>
                    )}
                  </HStack>
                </Box>
                <Box>
                  <HStack spacing={3}>
                    <Checkbox required value={checkedThree} onChange={handleChangeThree}>
                      Large
                    </Checkbox>
                    {checkedThree ? (
                      <Input
                        value={large}
                        onChange={(e) => setLarge(e.target.value)}
                        placeholder="Price"
                        required
                        type="number"
                        max="100000"
                        min="1"
                      />
                    ) : (
                      <></>
                    )}
                  </HStack>
                </Box>
              </VStack>

              <Box mt={5} display={"flex"} justifyContent={"center"}>
                {" "}
                <Button colorScheme="teal" size="md" type="submit">
                  Add
                </Button>
              </Box>
            </form>
          </Box>
        </Card>
      </Box>
    </Navbar>
  );
};

export default AddPizza;
