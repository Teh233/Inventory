import React from "react";
import { Box, Button, Typography, styled } from "@mui/material";
import BoxDetails from "./BoxDetails";
import Loading from "../../../components/Common/Loading";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  useGetOneLogisticsQuery,
  useAddBoxDetailsMutation,
} from "../../../features/api/logisticsApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const StyleSpan = styled("span")(({ theme }) => ({
  padding: "5px",
  border: "0.5px solid black",
  background: theme.palette.mode === "dark" ? "#fff" : "#fff",
  color: theme.palette.mode === "dark" ? "black" : "black",
  borderRadius: "5px",
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const AddBoxDetails = () => {
  /// initialize
  const { id } = useParams();
  const navigate = useNavigate();

  /// local state
  const [boxArray, setBoxArray] = useState([]);
  const [imageFile, setImageFile] = useState([]);


  /// rtk query
  const { data: oneLogisticsData, refetch } = useGetOneLogisticsQuery(id);
  const [addBoxDetailsApi, { isLoading }] = useAddBoxDetailsMutation();
  
  const date = new Date(oneLogisticsData?.data?.Date).toLocaleDateString(
    "en-IN",
    { imeZone: "Asia/Kolkata" }
  );
  /// useEffect

  useEffect(() => {
    if (oneLogisticsData?.status === "success") {
      const noOfBox = +oneLogisticsData.data.Box;
      const newEmptyArray = Array.from({ length: noOfBox }, () => ({
        imageFile: "",
        weight: "",
        actualWeight: "",
        length: "",
        width: "",
        height: "",
        marking: "",
        description: "",
      }));
      setBoxArray(newEmptyArray);
    }
  }, [oneLogisticsData]);

  /// handlers
  const handleSubmit = async () => {
    try {
      validateDataArray(boxArray);
      await Promise.all(
        boxArray.map(async (item, index) => {
          const formdata = new FormData();
          formdata.append("weight", item.weight);
          formdata.append("length", item.length);
          formdata.append("width", item.width); // Change 'breadth' to 'width'
          formdata.append("height", item.height);
          formdata.append("actWeight", item.actualWeight);
          formdata.append("marking", item.marking);
          formdata.append("description", item.description);
          formdata.append("photo", item.imageFile);

          const info = {
            id: id,
            body: formdata,
          };
      
          await addBoxDetailsApi(info);
        })
      );

      successdisplay();
    } catch (err) {
      console.log("Error at addBoxes: " + err);
      toast.error(err.message);
    }
  };

  const handleInputChange = (event, index) => {
    const { value, name } = event.target;
    const updatedBoxArray = boxArray.map((box, i) => {
      return i === index ? { ...box, [name]: value } : box;
    });

    const validProperties = ["weight", "length", "height", "width"];

    if (validProperties.includes(name)) {
      const newUpdatedBoxArray = updatedBoxArray.map((box, i) => {
        return i === index
          ? { ...box, actualWeight: actualWeightCalc(box) }
          : box;
      });

      setBoxArray(newUpdatedBoxArray);
      return;
    }

    setBoxArray(updatedBoxArray);
  };

  const handleFileInputChange = (event, index) => {
    const file = event.target.files[0];
    const updatedBoxArray = boxArray.map((box, i) => {
      return i === index ? { ...box, imageFile: file } : box;
    });

    setBoxArray(updatedBoxArray);
  };

  /// function

  const actualWeightCalc = (box) => {
    const { length = 0, width = 0, height = 0, weight = 0 } = box;

    const value =
      oneLogisticsData?.data?.CourierType === "courier" ? 5000 : 6000;

    const actualLength = parseFloat(length);
    const actualWidth = parseFloat(width);
    const actualHeight = parseFloat(height);
    const actualWeight = parseFloat(weight);

    const volumeWieght = (actualLength * actualWidth * actualHeight) / value;

    if (volumeWieght > actualWeight) {
      return volumeWieght.toFixed(2);
    }

    return actualWeight.toFixed(2);
  };

  const successdisplay = () => {
    Swal.fire({
      title: "Logistics Box details!",
      text: "Submitted.",
      icon: "success",
      showConfirmButton: false,
    });
    const close = () => {
      setTimeout(function () {
        Swal.close();

        navigate("/logisticList");
      }, 3000);
    };
    close();
  };

  function validateDataArray(dataArray) {
    dataArray.forEach((data, index) => {
      for (const key in data) {
        if (
          key !== "imageFile" && // Exclude the "imageFile" key
          data.hasOwnProperty(key) &&
          (data[key] === undefined || data[key] === null || data[key] === "")
        ) {
          throw new Error(`Box ${index + 1} "${key}" is required.`);
        }
      }
    });
  }
  return (
    <>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
      >
        <Loading loading={isLoading} />
        <DrawerHeader />
        <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "10px",
        }}
      >
        <Typography variant="body2" gutterBottom>
          <StyleSpan>Date: {date}</StyleSpan>
        </Typography>
        <Typography variant="body2" gutterBottom>
          <StyleSpan>HAWB no: {oneLogisticsData?.data?.Hawb}</StyleSpan>
        </Typography>
        <Typography variant="body2" gutterBottom>
          <StyleSpan>PI: {oneLogisticsData?.data?.Pi}</StyleSpan>
        </Typography>

        <Typography variant="body2" gutterBottom>
          <StyleSpan>LogisticId: {oneLogisticsData?.data?.logisticId}</StyleSpan>
        </Typography>

        <Typography variant="body2" gutterBottom>
          <StyleSpan>Box: {oneLogisticsData?.data?.Box}</StyleSpan>
        </Typography>
      </Box>
      
   
<Box sx={{
  height:"77vh",
  overflowY: "auto",
  paddingX:"10px"
}}>
          {boxArray.map((item, index) => {
            return (
              <div
                key={index}
                className="boxdetails"
                style={{
                  marginTop: "0.5rem",
                  backgroundColor: "#f5f5f5",
                  // borderTop: "1px solid #61045f",
                }}
              >
                <h3 style={{ textAlign: "center" }}>Box {index + 1}</h3>

                <BoxDetails
                  key={index}
                  handleInputChange={handleInputChange}
                  index={index}
                  boxDetails={boxArray[index]}
                  imageFile={imageFile}
                  handleFileInputChange={handleFileInputChange}
                />
              </div>
            );
          })}
</Box>
          <div style={{ textAlign: "center", margin: "20px" }}>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
  
      </Box>
    </>
  );
};

export default AddBoxDetails;
