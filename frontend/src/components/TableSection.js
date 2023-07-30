import React, { useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import Pages from "./Pages";
import MyTable from "./MyTable";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import "./TableSection.css";
import { MyContext } from "./MyContext";
function TableSection() {
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalpages] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [headers, setHeaders] = useState([]);
  const { addedUser, setAddedUser, setPhoneEditError } = useContext(MyContext);

  const itemsPerPage = 10;
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUsersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (addedUser === true) {
      fetchUsersData();
      goToLastPage();
      setAddedUser(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedUser]);
  const fetchUsersData = async () => {
    try {
      const url = "http://localhost:8082/v1/user/all";
      const result = await axios.get(url);
      if (result.status === 200) {
        if (result.data.users.length > 0) {
          let currHeaders = [...Object.keys(result.data.users[0]), "actions"];
          currHeaders = currHeaders.map((item) => {
            return item
              .split("_")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join("");
          });
          setHeaders([...currHeaders]);
          setUsersData(result.data.users);
          setIsLoading(false);
          setTotalpages(Math.ceil(result.data.users.length / 10));
        }
      }
    } catch (e) {
      setIsLoading(false);
      if (e.response) {
        enqueueSnackbar(e.response.data.message, {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Something went wrong, please check backend console", {
          variant: "error",
        });
      }
    }
  };

  const handleNextPageCall = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPageCall = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const goToFirstPage = () => {
    setCurrentPage(1);
  };
  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const getPaginatedData = () => {
    const startIndex =
      (currentPage === 0 ? 1 : currentPage) * itemsPerPage - itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    if (currentPage === 0) setCurrentPage(1);

    return usersData.slice(startIndex, endIndex);
  };
  const handleSelectedRows = (rows) => {
    setSelectedRows(rows);
  };

  const handleDelete = async (email) => {
    try {
      const url = "http://localhost:8082/v1/user/" + email;
      const result = await axios.delete(url);
      if (result.status === 200) {
        const newUsersData = usersData.filter((user) => user.email !== email);
        setUsersData(newUsersData);
        setTotalpages(Math.ceil(newUsersData.length / 10));
        enqueueSnackbar(result.data.message, {
          variant: "success",
        });
      }
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Something went wrong, please check backend console", {
          variant: "error",
        });
      }
    }
  };
  const handleSave = async (e, row) => {
    e.preventDefault();
    const phoneNumber = row.phone;
    const phoneRegex = /^[1-9][0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneEditError(true);
      return;
    }
    try {
      const url = "http://localhost:8082/v1/user/" + row.email;
      const result = await axios.patch(url, row);
      if (result.status === 204) {
        let newUsersData = usersData.map((user) => {
          if (user.email === row.email) {
            user = { ...user, ...row };
          }
          return user;
        });
        setUsersData(newUsersData);
        setEditOpen(false);
      }
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Something went wrong, please check backend console", {
          variant: "error",
        });
      }
    }
  };

  return (
    <>
      <Card sx={{ margin: "auto", backgroundColor: "#61677A" }}>
        <CardContent>
          {isLoading ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <CircularProgress />
              </div>
            </>
          ) : (
            <>
              {usersData.length > 0 ? (
                <>
                  <MyTable
                    currentUsersData={getPaginatedData()}
                    selectedRows={selectedRows}
                    handleSelectedRows={handleSelectedRows}
                    headers={headers}
                    currentPage={currentPage}
                    handleNextPageCall={handleNextPageCall}
                    handlePrevPageCall={handlePrevPageCall}
                    handleDelete={handleDelete}
                    handleSave={handleSave}
                    editOpen={editOpen}
                    setEditOpen={setEditOpen}
                  />
                  <br />
                  <Pages
                    noOfPages={totalPages}
                    currentPage={currentPage}
                    handleNextPageCall={handleNextPageCall}
                    handlePrevPageCall={handlePrevPageCall}
                    goToFirstPage={goToFirstPage}
                    goToLastPage={goToLastPage}
                  />
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "87vh",
                    }}
                  >
                    <Card sx={{ height: "80vh", width: "80%", boxShadow: 4 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "20px",
                          }}
                        >
                          No users are present in db please add some to view
                        </Typography>
                      </Box>
                    </Card>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default TableSection;
