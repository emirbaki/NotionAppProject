import React, { useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Tooltip} from '@mui/material';
import { Delete, Share } from '@mui/icons-material';
import ReactDraft from '../reactDraft';
import { NoteProps } from '../Interfaces';



const NoteObject: React.FC<NoteProps> = ({id, title, content, onUpdate, onDeleteNote, onShare }) => {
  const handleContentChange = (newContent: string) => {
    onUpdate(newContent);
  };

  return (
    <Card sx={{  width: '80%'}}>
      <CardContent sx={{  height: '100%'}}>
        <Typography variant="h6">{title}</Typography>
        <Tooltip title="Delete">
            <IconButton onClick=  { () => onDeleteNote(id) }>
              <Delete color="error" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton onClick={onShare}>
              <Share />
            </IconButton>
          </Tooltip>
        <ReactDraft content={content} onUpdate={handleContentChange}></ReactDraft>
      </CardContent>
    </Card>
  );
};

export default NoteObject;
