import React, { useState } from 'react';
import { List, Button, TextField } from '@mui/material';
import { AddCircleOutlineRounded} from '@mui/icons-material';
import axios from 'axios';

interface SidebarProps {
  onCreate?: (title: string, content: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCreate }) => {
  
  const [newTitle, setNewTitle] = useState('');



  const insertCollection = async () => {
    if (!newTitle) return;

    try {
      const response = await axios.post('http://localhost:3000/collections', {
        title: newTitle,
      });
      console.log('Note created successfully:', response.data);
      
      onCreate!(response.data.title, response.data.content); // Pass ID to parent component
      setNewTitle('');
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
      onClick={insertCollection}
      >
      Add A New Collection
      </Button>
      <TextField
        label="New Collection Title"
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        fullWidth
        style={{paddingTop: 20}}
      />
    </List>
  );
};

export default Sidebar;
