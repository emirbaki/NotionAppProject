import React, { useState } from 'react';
import { List, ListItemText, ListItemIcon, ListItemButton, Button, TextField } from '@mui/material';
import { AddCircleOutlineRounded, FolderOpenOutlined } from '@mui/icons-material';
import axios from 'axios';
import {Note} from '../utils/Interfaces';
import mongoose from 'mongoose';

interface SidebarProps {
  notes: Note[];
  onNoteClick: (id: string) => void; // Function to handle note selection
  onCreate?: (title: string, content: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ notes, onNoteClick, onCreate }) => {
  
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState(' ');



  const insertNote = async () => {
    if (!newTitle || !newContent) return;

    try {
      const response = await axios.post('http://localhost:3000/notes', {
        title: newTitle,
        content: newContent,
      });
      console.log('Note created successfully:', response.data);
      
      onCreate!(response.data.title, response.data.content); // Pass ID to parent component
      setNewTitle('');
      setNewContent('');
    } catch (error) {
      console.error('Error creating note:', error);
      // Handle errors appropriately (e.g., display error message to user)
    }
    window.location.reload();
  };


  return (
    <List sx={{ width: 250, bgcolor: 'background.paper' }}>
      <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<AddCircleOutlineRounded/>}
      onClick={insertNote}
      >
      Add A New Note
      </Button>
      <TextField
        label="Note Title"
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        fullWidth
        style={{paddingTop: 20}}
      />
      <TextField
        label="Note Content"
        value={newContent}
        onChange={(event) => setNewContent(event.target.value)}
        multiline
        fullWidth
        style={{paddingTop: 10}}
      />
      {notes.map((note) => (
        <ListItemButton key={note.id} onClick={() => onNoteClick(note.id)}>
          <ListItemIcon>
            <FolderOpenOutlined />
          </ListItemIcon>
          <ListItemText primary={note.title} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default Sidebar;
