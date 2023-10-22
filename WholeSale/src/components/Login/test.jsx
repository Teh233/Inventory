import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const Test = () => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
  ];

  const rows = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Johnson" },
  ];

  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (params) => {
    setSelectedRows(params.selectionModel);
  };

  const handleCheckboxClick = (event, params) => {
    event.stopPropagation();
  };

  const isRowSelected = (params) => {
    return selectedRows.includes(params.row.id.toString());
  };

  const isRowSelectable = (params) => {
    return !params.row.isSelected;
  };
  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        disableSelectionOnClick
        isRowSelectable={isRowSelectable}
        onSelectionModelChange={handleSelectionChange}
        components={{
          Checkbox: (props) => (
            <input
              type="checkbox"
              onClick={(e) => handleCheckboxClick(e, props)}
            />
          ),
        }}
      />
    </div>
  );
};

export default Test;
