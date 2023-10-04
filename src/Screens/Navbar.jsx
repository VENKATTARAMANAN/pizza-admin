import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image,
  Center,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import React, { useEffect } from "react";
import pizzaicon from "../assets/pizza_mania.png";
import admin from "../assets/admin.jpg";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ children }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogOut = () => {
    localStorage.removeItem("AuthTokenAdmin");
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("AuthTokenAdmin");
    if (!token) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <Box
        bg={useColorModeValue("white", "gray.900")}
        w="100vw"
        px={{ base: "20px", md: "100px" }}
        position="fixed"
        top={0}
        zIndex={100}
        boxShadow={"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}
      >
        <Box display={{ md: "none" }} >
          <Box display={"flex"}  justifyContent={"space-between"}>
          <Box  display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              onClick={isOpen ? onClose : onOpen}
            />
          </Box>
          <Box >
            <Image src={pizzaicon} alt="logo" width={"60px"} />
          </Box>
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"none"}
                cursor={"pointer"}
                minW={0}
                bg={"transparent"}
              >
                <Avatar size={"sm"} src={admin} />
              </MenuButton>
              <MenuList>
                <MenuItem>Welcome,User</MenuItem>
                <MenuItem onClick={handleLogOut}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Box>
          </Box>
        </Box>

        <Box
          display={{ base: "none", lg: "flex", md: "flex", sm: "none" }}
          justifyContent={{ lg: "space-between", sm: "center" }}
        >
          <Box display={"flex"} alignItems={"center"}>
            <Image src={pizzaicon} alt="logo" width={"60px"} />
          </Box>
          <Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <Button
                fontSize="20px"
                fontWeight="bold"
                bgColor="transparent"
                h="70px"
                variant={"none"}
                as={Link}
                to="/orders"
              >
                Pending-Orders
              </Button>
              <Button
                fontSize="20px"
                fontWeight="bold"
                bgColor="transparent"
                h="70px"
                variant={"none"}
                as={Link}
                to="/stock"
              >
                Stock
              </Button>
              <Button
                fontSize="20px"
                fontWeight="bold"
                bgColor="transparent"
                h="70px"
                variant={"none"}
                as={Link}
                to="/pizza"
              >
                Pizza
              </Button>
              <Button
                fontSize="20px"
                fontWeight="bold"
                bgColor="transparent"
                h="70px"
                variant={"none"}
                as={Link}
                to="/completedorders"
              >
                Completed orders
              </Button>
            </HStack>
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"none"}
                cursor={"pointer"}
                minW={0}
                bg={"transparent"}
              >
                <Avatar size={"sm"} src={admin} />
              </MenuButton>
              <MenuList mt={2}>
              <MenuItem>Welcome,User</MenuItem>
                <MenuItem onClick={handleLogOut}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Box>
        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <Center>
                <Text fontWeight={"bold"} as={Link} to="/orders">
                  Pending-orders
                </Text>
              </Center>
              <Center>
                <Text fontWeight={"bold"} as={Link} to="/stock">
                  Stock
                </Text>
              </Center>
              <Center>
                <Text fontWeight={"bold"} as={Link} to="/pizza">
                  Pizza
                </Text>
              </Center>
              <Center>
                <Text fontWeight={"bold"} as={Link} to="/completedorders">
                  Completed Orders
                </Text>
              </Center>
            </Stack>
          </Box>
        ) : null}
      </Box>
      <Box p={4}>{children}</Box>
    </>
  );
};

export default Navbar;
