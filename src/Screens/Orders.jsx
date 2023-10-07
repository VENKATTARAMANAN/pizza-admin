import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Image,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { url } from "../config/api";
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
} from "@chakra-ui/react";
import Lottie from "lottie-react";
import nopendingorders from "../assets/no_pending_orders.json";

const steps = [
  { description: "Order Confirmed" },
  { description: "Preparing Your Pizza" },
  { description: "Out For Delivery" },
  { description: " Order Delivered " },
];

const Orders = () => {
  const toast=useToast();
  const [cod, setCod] = useState([]);
  const [onlinepaid, setOnlinePaid] = useState([]);

  console.log(cod,onlinepaid);
  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${url}/admin/getorders`,{
        headers:{
          Authorization:localStorage.getItem("AuthTokenAdmin")
        }
      });
      if (data.data.statuscode === 200) {
        setCod(data.data.cod.reverse());
        setOnlinePaid(data.data.online.reverse());
      } else if (data.statuscode === 204) {
        console.log("no data found");
      }
    } catch (error) {
      alert(error.response.data.data);
    }
  };

  const changeOrderStatus = async (val, orderType) => {
    try {
      const { data } = await axios.post(
        `${url}/admin/updataorderstatus`,
        { id: val, orderType },{
          headers:{
            Authorization:localStorage.getItem("AuthTokenAdmin")
          }
        }
      );
      getOrders();
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
    getOrders();
  }, []);
  return (
    <Navbar>
        <Box mt="8" pt={12} ml={{ xl: 20 }} mr={{ xl: 20 }}>
          <Heading
            display={"flex"}
            justifyContent={"center"}
            textDecoration={"underline"}
            fontSize={25}
          >
            Pending Orders
          </Heading>
          <Accordion mt="3" defaultIndex={[0]} allowMultiple bg={"white"}>
            <AccordionItem bg={"rgb(251, 197, 60)"}>
              <h2>
                <AccordionButton>
                  <Box
                    as="span"
                    flex="1"
                    textAlign="left"
                    fontWeight={"bold"}
                    fontSize={"20px"}
                  >
                    Cash On Delivery Orders
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              {cod.map((val, index) =>
                val.orderstatus === "pending" ? (
                  <AccordionPanel pb={4} bg={"white"} key={index}>
                    <AccordionItem>
                      <h2>
                        <AccordionButton
                          bg={"rgb(251, 197, 60)"}
                          variant={"none"}
                        >
                          <Box
                            as="span"
                            flex="1"
                            textAlign="left"
                            fontSize={"15px"}
                          >
                            UserID:{val.userid} <br />
                            OrderID:{val._id}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {val.items.map((val, index) => (
                          <Box
                            key={index}
                            bg={"white"}
                            fontFamily={"'Roboto Slab', serif"}
                            mt={3}
                            display={"flex"}
                            gap={10}
                          >
                            <Box>
                              <Image
                                src={val.image}
                                alt="image"
                                width={"75px"}
                                height={"75px"}
                              />
                            </Box>
                            <Box
                              width={"100px"}
                              display={"flex"}
                              alignItems={"center"}
                            >
                              {val.name}
                            </Box>
                            <Box display={"flex"} alignItems={"center"}>
                              Quantity <br />
                              {val.quantity}
                            </Box>
                            <Box display={"flex"} alignItems={"center"}>
                              Price <br />
                              {val.price}
                            </Box>
                          </Box>
                        ))}
                        <br />
                        <hr />
                        <Box mt={3}>
                          <Box textDecoration={"underline"} fontWeight={"bold"}>
                            <h2>Order Status</h2>
                          </Box>
                          <Box mt={2}>
                            <Stepper size="sm" index={val.orderstep}>
                              {steps.map((step, index) => (
                                <Step key={index}>
                                  <VStack
                                    spacing={2}
                                    display={"flex"}
                                    alignItems={"center"}
                                  >
                                    <Box>
                                      <StepIndicator>
                                        <StepStatus
                                          complete={<StepIcon />}
                                          incomplete={<StepNumber />}
                                          active={<StepNumber />}
                                        />
                                      </StepIndicator>
                                    </Box>
                                    <Box>
                                      <StepDescription
                                        fontSize={10}
                                        height={15}
                                      >
                                        {step.description}
                                      </StepDescription>
                                    </Box>
                                  </VStack>
                                  <StepSeparator />
                                </Step>
                              ))}
                            </Stepper>
                          </Box>
                          <Box
                            mt={[9, 6, 6, 8]}
                            display={"flex"}
                            justifyContent={"center"}
                          >
                            <Button
                              bg={"rgb(251, 197, 60)"}
                              onClick={() => changeOrderStatus(val._id, "cod")}
                            >
                              Update Order Status
                            </Button>
                          </Box>
                        </Box>
                        <Box
                          mt={4}
                          textDecoration={"underline"}
                          fontWeight={"bold"}
                        >
                          <h2>Order Details</h2>
                        </Box>
                        <Box mt={2} gap={6} display={"flex"}>
                          <Box>
                            <Text
                              textDecoration={"underline"}
                              fontWeight={"bold"}
                            >
                              {" "}
                              Total{" "}
                            </Text>
                            <Text>{val.total}</Text>
                          </Box>
                          <Box>
                            <Text
                              textDecoration={"underline"}
                              fontWeight={"bold"}
                            >
                              {" "}
                              Payment Mode{" "}
                            </Text>
                            <Text>{val.paymentmode}</Text>
                          </Box>
                          <Box>
                            <Text
                              textDecoration={"underline"}
                              fontWeight={"bold"}
                            >
                              Payment Status
                            </Text>
                            <Text>{val.paymentstatus}</Text>
                          </Box>
                          <Box>
                            <Text
                              textDecoration={"underline"}
                              fontWeight={"bold"}
                            >
                              Address
                            </Text>
                            <Text> {val.address.name},</Text>
                            <Text>
                              {val.address.houseno},{val.address.street},
                            </Text>
                            <Text>
                              {val.address.city}-{val.address.pincode}.
                            </Text>
                            <Text>Phone : {val.address.phone},</Text>
                            <Text>Landmark : {val.address.landmark}</Text>
                          </Box>
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  </AccordionPanel>
                ) : (
                  <></>
                )
              )}
            </AccordionItem>
          </Accordion>
          {/* -------------------------------------------------------------------------------------------- */}
          <Accordion defaultIndex={[0]} allowMultiple bg={"white"}>
            <AccordionItem bg={"rgb(251, 197, 60)"}>
              <h2>
                <AccordionButton>
                  <Box
                    as="span"
                    flex="1"
                    textAlign="left"
                    fontWeight={"bold"}
                    fontSize={"20px"}
                  >
                    Online Paid Orders
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              {onlinepaid.map((val, index) =>
                val.orderstatus === "pending" ? (
                  <AccordionPanel pb={4} key={index} bg={"white"}>
                    <AccordionItem>
                      <h2>
                        <AccordionButton
                          bg={"rgb(251, 197, 60)"}
                          variant={"none"}
                        >
                          <Box
                            as="span"
                            flex="1"
                            textAlign="left"
                            fontSize={"15px"}
                          >
                            UserID:{val.userid} <br />
                            OrderID:{val._id}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {val.items.map((val, index) => (
                          <Box mt={3} key={index}>
                            <Box
                              bg={"white"}
                              fontFamily={"'Roboto Slab', serif"}
                              display={"flex"}
                              gap={5}
                            >
                              <Box>
                                <Image
                                  src={val.image}
                                  alt="image"
                                  width={"75px"}
                                  height={"75px"}
                                />
                              </Box>
                              <Box
                                width={"100px"}
                                display={"flex"}
                                alignItems={"center"}
                              >
                                {val.name}
                              </Box>
                              <Box display={"flex"} alignItems={"center"}>
                                Quantity <br />
                                {val.quantity}
                              </Box>
                              <Box display={"flex"} alignItems={"center"}>
                                Price <br />
                                {val.price}
                              </Box>
                            </Box>
                            <br />
                            <hr />
                          </Box>
                        ))}
                        <Box mt={3}>
                          <Box textDecoration={"underline"} fontWeight={"bold"}>
                            <h2>Order Status</h2>
                          </Box>
                          <Box mt={2}>
                            <Stepper size="sm" index={val.orderstep}>
                              {steps.map((step, index) => (
                                <Step key={index}>
                                  <VStack
                                    spacing={2}
                                    display={"flex"}
                                    alignItems={"center"}
                                  >
                                    <Box>
                                      <StepIndicator>
                                        <StepStatus
                                          complete={<StepIcon />}
                                          incomplete={<StepNumber />}
                                          active={<StepNumber />}
                                        />
                                      </StepIndicator>
                                    </Box>
                                    <Box>
                                      <StepDescription
                                        fontSize={10}
                                        height={15}
                                      >
                                        {step.description}
                                      </StepDescription>
                                    </Box>
                                  </VStack>
                                  <StepSeparator />
                                </Step>
                              ))}
                            </Stepper>
                          </Box>
                          <Box
                            mt={6}
                            display={"flex"}
                            justifyContent={"center"}
                          >
                            <Button
                              bg={"rgb(251, 197, 60)"}
                              onClick={() => changeOrderStatus(val._id, "paid")}
                            >
                              Update Order Status
                            </Button>
                          </Box>
                        </Box>
                        <Box
                          mt={4}
                          textDecoration={"underline"}
                          fontWeight={"bold"}
                        >
                          <h2>Order Details</h2>
                        </Box>
                        <Box mt={2} gap={6} display={"flex"}>
                          <Box>
                            <Text
                              textDecoration={"underline"}
                              fontWeight={"bold"}
                            >
                              {" "}
                              Total{" "}
                            </Text>
                            <Text>{val.total}</Text>
                          </Box>
                          <Box>
                            <Text
                              textDecoration={"underline"}
                              fontWeight={"bold"}
                            >
                              {" "}
                              Payment Mode{" "}
                            </Text>
                            <Text>{val.paymentmode}</Text>
                          </Box>
                          <Box>
                            <Text
                              textDecoration={"underline"}
                              fontWeight={"bold"}
                            >
                              Payment Status
                            </Text>
                            <Text>{val.paymentstatus}</Text>
                          </Box>
                          <Box>
                            <Text
                              textDecoration={"underline"}
                              fontWeight={"bold"}
                            >
                              Address
                            </Text>
                            <Text> {val.address.name},</Text>
                            <Text>
                              {val.address.houseno},{val.address.street},
                            </Text>
                            <Text>
                              {val.address.city}-{val.address.pincode}.
                            </Text>
                            <Text>Phone : {val.address.phone},</Text>
                            <Text>Landmark : {val.address.landmark}</Text>
                          </Box>
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  </AccordionPanel>
                ) : (
                  <></>
                )
              )}
            </AccordionItem>
          </Accordion>
        </Box> 
    </Navbar>
  );
};

export default Orders;
