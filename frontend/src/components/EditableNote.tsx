import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import { Edit, MoreVert } from '@mui/icons-material';

const EditableNote = ({ title, content, onUpdate }: { title: string; content: string; onUpdate: (title: string, content: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editText, setEditText] = useState(content);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveClick = () => {
    onUpdate(editTitle, editText);
    handleClose();
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(event.target.value);
  };

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <Typography variant="body2">{title}</Typography>
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField
              autoFocus
              multiline
              rows={4}
              value={editText}
              onChange={handleContentChange}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleClose}>
            <MoreVert />
          </IconButton>
          <IconButton onClick={handleSaveClick}>
            <Edit />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditableNote;
