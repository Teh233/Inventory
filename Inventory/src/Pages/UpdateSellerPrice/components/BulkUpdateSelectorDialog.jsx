import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const BulkUpdateSelectorDialog = ({ list, open, setOpen }) => {
  const [newList, setNewList] = useState(list?.filter((item) => item.id !== 7));

  /// initialize
  const navigate = useNavigate();

  /// handler
  const handleClose = () => {
    setOpen(false);
  };

  const onClick = (name) => {
    navigate(`/UpdateSellerPriceBulk/${name}`);
  };

  /// useEffect

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select option To bulk update</DialogTitle>
      <DialogActions>
        {newList?.map((item) => {
          return (
            <Button
              key={item.id}
              onClick={() => {
                onClick(item.name);
              }}
              color="primary"
            >
              {item.name}
            </Button>
          );
        })}
      </DialogActions>
    </Dialog>
  );
};

export default BulkUpdateSelectorDialog;
