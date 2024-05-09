import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ListItemButton, TextField, Tooltip, Typography } from '@mui/material';
import { Delete, Edit, MoreVert, Save, Share } from '@mui/icons-material';
import { NoteProps } from '../utils/Interfaces';
import ReactDraft from '../reactDraft';
import axios from 'axios';

const EditableNote: React.FC<NoteProps> = ({ _id, title, content, onUpdate, onShare, onDelete}) => {
  const [open, setOpen] = useState(false);
  const [editText, setEditText] = useState(content);

  const [editTitle, setEditTitle] = useState<string>(title);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
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
  const handleTitleEdit = () => {
    console.log("e giriyo");
    setIsEditingTitle(true); // Set isEditingTitle to true when Rename button is clicked
  };

  const handleTitleUpdate = () => {
    // Call the updateCollectionTitle function to update the collection title
    updateCollectionTitle(editTitle);
    setIsEditingTitle(false);
  };

  const updateCollectionTitle = async (newTitle: string) => {
    try {
      const token = localStorage.getItem('token');
      console.log("token bu: " + token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Send a PUT request to update the collection title
      await axios.put(`http://localhost:3000/notes/${_id}`, { title: newTitle });
      // Update the local state with the new title
      setEditTitle(newTitle);
      setIsEditingTitle(false);

    } catch (error) {
      console.error('Error updating collection title:', error);
    }
  };
  // const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setEditText(event.target.value);
  // };
  const handleContentChange = (content: string) => {
    setEditText(content);
  };

  return (
    <>
      <ListItemButton onClick={handleClickOpen}>
        <Typography variant="body2">{title}</Typography>
      </ListItemButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
        {
                    isEditingTitle ?
                        <TextField
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            autoFocus // Ensures the TextField gets focus when it appears
                        />
                        :
                        title

                }{isEditingTitle ? (
          <IconButton aria-label="save" onClick={handleTitleUpdate}>
            <Save />
          </IconButton>
        ) : (
          <IconButton aria-label="edit" onClick={handleTitleEdit}>
            <Edit />
          </IconButton>
        )}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <ReactDraft onUpdate={handleContentChange} content={content} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleClose}>
            <MoreVert />
          </IconButton>
          <IconButton onClick={handleSaveClick}>
            <Edit />
          </IconButton>
          <Tooltip title="Delete">
            <IconButton onClick={() => onDelete(_id)}>
              <Delete color="error" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton onClick={onShare}>
              <Share />
            </IconButton>
          </Tooltip>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditableNote;
