import React from 'react';
import { Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

interface Note {
  id: string;
  title: string;
  content: string;
}

interface CollectionContentProps {
  id: string;
  title: string;
  notes: Note[];
  onUpdate: (id: string, title: string, content: string) => void;
  onDeleteCollection: (id: string) => void;
  onShare: (id: string) => void;
  handleNoteClick: (id: string) => void;
}

const CollectionContent: React.FC<CollectionContentProps> = ({ title, notes, handleNoteClick }) => {
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <List>
        {notes.map((note) => (
          <div key={note.id}>
            <ListItem button onClick={() => handleNoteClick(note.id)}>
              <ListItemText primary={note.title} />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
};

export default CollectionContent;
