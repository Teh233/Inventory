import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";
import { useGetSinglePriceComparisionQuery } from "../../../features/api/RestockOrderApiSlice";
import { useParams } from "react-router-dom";
const columnsData = [
  { field: "Sno", headerName: "S.No" },
  { field: "SKU", headerName: "SKU" },
  { field: "Name", headerName: "Name" },
  { field: "QTY", headerName: "QTY" },
];
// import { styled } from "@mui/system";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: ".8rem",
  minWidth: "150px",
  textAlign: "center",
}));

const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "primary" : "#eee",
  color: theme.palette.mode === "dark" ? "white" : "black",
}));

const StyledTableCell3 = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#404040" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
}));

const CompareTable = () => {
  /// initialize

  const id = useParams().id;

  /// rtk query
  const { data: allCompareData } = useGetSinglePriceComparisionQuery(id);

  /// local state
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [assigned, setAssigned] = useState([]);

  /// useEffect
  useEffect(() => {
    if (allCompareData?.status === "success") {
      setRows(allCompareData.data.products);
      setColumns([...columnsData, ...allCompareData.data.columns]);

      setAssigned(allCompareData.data.columns);
    }
  }, [allCompareData]);

  const colourSelector = (vendorId, high, medium, low) => {
    if (high.includes(vendorId)) {
      return { backgroundColor: "#660000", color: "white" };
    } else if (low.includes(vendorId)) {
      return { backgroundColor: "#006600", color: "white" };
    } else if (medium.includes(vendorId)) {
      return { backgroundColor: "white", color: "black" };
    } else {
      return { backgroundColor: "#cccc00", color: "black" };
    }
  };

  return (
    <div>
      {" "}
      <TableContainer sx={{ maxHeight: "92vh", minHeight: "92vh" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <StyledTableCell2
                  key={column.field}
                  sx={{
                    fontSize: ".8rem",
                    minWidth: "50px",
                    position: "sticky",
                    left: `${
                      column.headerName === "S.No"
                        ? 0
                        : column.headerName === "SKU"
                        ? 3.78
                        : column.headerName === "Name"
                        ? 11.58
                        : column.headerName === "QTY"
                        ? 33.45
                        : 37
                    }rem`, // Adjust the values as needed
                    zIndex: 200,

                    textAlign: "center",
                  }}
                >
                  {column.headerName}
                </StyledTableCell2>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((item, index) => {
              return (
                <TableRow key={index}>
                  <StyledTableCell3
                    sx={{
                      fontSize: ".8rem",
                      minWidth: "50px",
                      position: "sticky",
                      left: 0,
                      zIndex: 200,
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </StyledTableCell3>
                  <StyledTableCell3
                    sx={{
                      fontSize: ".8rem",
                      minWidth: "50px",
                      position: "sticky",
                      left: 60,
                      zIndex: 200,
                      textAlign: "center",
                    }}
                  >
                    {item.SKU}
                  </StyledTableCell3>
                  <StyledTableCell3
                    sx={{
                      fontSize: ".8rem",
                      minWidth: "350px",
                      position: "sticky",
                      left: 185,
                      zIndex: 200,
                      textAlign: "center",
                    }}
                  >
                    {item.Name}
                  </StyledTableCell3>
                  <StyledTableCell3
                    sx={{
                      fontSize: ".8rem",
                      minWidth: "50px",
                      position: "sticky",
                      left: 535,
                      zIndex: 200,
                      textAlign: "center",
                    }}
                  >
                    {item.NewQuantity}
                  </StyledTableCell3>
                  {assigned.map((data) => {
                    return (
                      <StyledTableCell
                        key={data.field}
                        sx={{
                          backgroundColor: colourSelector(
                            data.field,
                            item.high,
                            item.medium,
                            item.low
                          ),
                        }}
                      >
                        {item[data.field] ? item[data.field] : "N/A"}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              );
            })}
            <TableRow></TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  //   return (
  //   <div>
  //     <TableContainer sx={{ maxHeight: '92vh' }}>
  //       <Table stickyHeader aria-label="sticky table">
  //         <TableHead>
  //           <TableRow>
  //             <TableCell sx={{fontSize: '.8rem', minWidth: '50px',position:"sticky",left:0 ,zIndex:200 ,backgroundColor:"#eee"}}>
  //               S.No
  //             </TableCell>
  //             <TableCell sx={{fontSize: '.8rem', minWidth: '50px',position:"sticky",left:60 ,zIndex:200 ,backgroundColor:"#eee"}} >
  //               SKU
  //             </TableCell>
  //             <TableCell sx={{fontSize: '.8rem', minWidth: '60px',position:"sticky",left:185 ,zIndex:200 ,backgroundColor:"#eee"}} >
  //               Name
  //             </TableCell>
  //             <TableCell sx={{fontSize: '.8rem', minWidth: '50px',position:"sticky",left:269 ,zIndex:200 ,backgroundColor:"#eee"}} >
  //               QTY
  //             </TableCell>
  //             {dummyData.map((column) => (
  //               <TableCell
  //                 sx={{
  //                   fontSize: '.8rem',
  //                   minWidth: '150px',
  //                   backgroundColor: '#eee',

  //                 }}
  //                 key={column.field}
  //               >
  //                 {column.headerName}
  //               </TableCell>
  //             ))}
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {rows.map((item, index) => (
  //             <TableRow key={index}>
  //               <TableCell sx={{ fontSize: '.8rem', minWidth: '50px',position:"sticky",left:0 ,zIndex:200 ,backgroundColor:"#eee"}}>{index + 1}</TableCell>
  //               <TableCell sx={{ fontSize: '.8rem', minWidth: '50px',position:"sticky",left:60 ,zIndex:200 ,backgroundColor:"#eee"}}>{item.SKU}</TableCell>
  //               <TableCell sx={{ fontSize: '.8rem', minWidth: '50px',position:"sticky",left:185 ,zIndex:200 ,backgroundColor:"#eee" }}>
  //                 {item.Name}
  //               </TableCell>
  //               <TableCell sx={{ fontSize: '.8rem', minWidth: '50px',position:"sticky",left:269 ,zIndex:200 ,backgroundColor:"#eee" }}>
  //                 {item.NewQuantity}
  //               </TableCell>
  //               {dummyData.map((data) => (
  //                 <TableCell
  //                   key={data.field}
  //                   sx={{
  //                     fontSize: '.8rem',
  //                     minWidth: '150px',
  //                     backgroundColor: colourSelector(
  //                       data.field,
  //                       item.high,
  //                       item.medium,
  //                       item.low
  //                     ),
  //                   }}
  //                 >
  //                   {item[data.field] ? item[data.field] : 'N/A'}
  //                 </TableCell>
  //               ))}
  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   </div>
  // );
};

export default CompareTable;
