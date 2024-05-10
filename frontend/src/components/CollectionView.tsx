import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, Menu, MenuItem, TextField } from '@mui/material';
import { AddCircleOutline, Edit, MoreHorizRounded, Save } from '@mui/icons-material';
import EditableNote from './EditableNote';
import { Collection, Note } from '../utils/Interfaces';
import axios from 'axios';
import ShareDialog from './ShareDialog';

async function fetchNotes(id: string): Promise<Note[]> {
    try {
        const response = await axios.get<Collection>(`http://localhost:3000/collections/${id}`);
        if (!response.data || !response.data.noteCollection) {
            console.error('Invalid response data or missing notes property');
            return [];
        }

        const noteIDs = response.data.noteCollection;

        // Ensure notes is an array (might be undefined or null)
        if (!Array.isArray(noteIDs)) {
            console.error('Unexpected notes data format (not an array)');
            return [];
        }
        const notes: Note[] = [];

        for (const noteID of noteIDs) {
            const response = await axios.get<Note>(`http://localhost:3000/notes/${noteID}`)
            notes.push(response.data);
        }
        // Handle empty notes array using optional chaining and default value
        return notes;
    } catch (error) {
        console.error('Error fetching notes:', error);
        return []; // Return empty array on error
    }
}


const CollectionObject = ({ id, title, onUpdateNote, onShare, deleteCollection }:
    {
        id: string; title: string; onUpdateNote: (index: number, title: string, content: string) => void;
        onAddNote: () => void;
        onShare: () => void;
        deleteCollection: (id : string) => void;
    }) => {
    const Root = styled(Card)({
        marginBottom: '16px',

    });
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [editTitle, setEditTitle] = useState<string>(title);
    const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    // const [newNoteTitle, setNewNoteTitle] = useState<string>('');
    // const [newNoteContent, setNewNoteContent] = useState<string>('');
    const [openShareDialog, setOpenShareDialog] = useState<boolean>(false);


    const newNoteTitleRef = useRef<string>('');
    const newNoteContentRef = useRef<string>('');
    // Function to open the ShareDialog
    const handleShare = () => {
        setOpenShareDialog(true);
    };
    
    // Function to close the ShareDialog
    const handleCloseShareDialog = () => {
        setOpenShareDialog(false);
    };

    const [isCancelClicked, setIsCancelClicked] = useState(false);

    const handleCloseDialog = () => {
      if (isCancelClicked) {
        setOpenDialog(false);
        newNoteTitleRef.current = '';
        newNoteContentRef.current = '';
        setIsCancelClicked(false);
      }
    };
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDelete = () => {
        deleteCollection(id);
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
            const token = sessionStorage.getItem('token');
            console.log("token bu: " + token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Send a PUT request to update the collection title
            await axios.put(`http://localhost:3000/collections/${id}`, { title: newTitle });
            // Update the local state with the new title
            setEditTitle(newTitle);
            setIsEditingTitle(false);

        } catch (error) {
            console.error('Error updating collection title:', error);
        }
    };
    useEffect(() => {
        readNotes();
        newNoteTitleRef.current = '';
        newNoteContentRef.current = '';
    }, []);
   
    

    const readNotes = async () => {
        try {
            const token = sessionStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setNotes(await fetchNotes(id));
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };
    const handleAddNote = () => {
        setOpenDialog(true);
    };


    const handleSaveNote = async () => {
        try {
            const token = sessionStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Send a POST request to create a new note
            const response = await axios.post('http://localhost:3000/notes/', {
                title: newNoteTitleRef.current,
                content: newNoteContentRef.current
            });

            const response2 = await axios.put(`http://localhost:3000/collections/${id}/note`, {noteId: response.data._id })
            console.log(response2.data);
            // Add the newly created note to the collection
            setNotes([...notes, response.data]);
            handleCloseDialog();
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };
    const deleteNote = async (noteid: string) => {
        console.log("Deleting note with ID:", id);
        try {
            const token = sessionStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await axios.delete(`http://localhost:3000/collections/${id}/note/${noteid}`)
            await axios.delete(`http://localhost:3000/notes/${noteid}`);
            setNotes(notes.filter((note) => note._id !== noteid));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };
    // const updateNote = async (content: string) => {
    //     const id = selectedNote?._id
    //     try {
    //         const token = localStorage.getItem('token');
    //         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    //         await axios.put(`http://localhost:3000/notes/${id}`, { content_thing: content });
    //     } catch (error) {
    //         console.error('Error updating notes:', error);
    //     }

    // };
    return (
        <Root>
            <CardHeader
                title={
                    isEditingTitle ?
                        <TextField
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            autoFocus // Ensures the TextField gets focus when it appears
                        />
                        :
                        title
                }
                action={
                    <div>
                        {isEditingTitle ? (
                            <IconButton aria-label="save" onClick={handleTitleUpdate}>
                                <Save />
                            </IconButton>
                        ) : (
                            <IconButton aria-label="edit" onClick={handleTitleEdit}>
                                <Edit />
                            </IconButton>
                        )}
                        <IconButton aria-label="add note" onClick={handleAddNote}>
                            <AddCircleOutline />
                        </IconButton>
                        <IconButton aria-label="details" onClick={handleClick}>
                            <MoreHorizRounded />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorReference="anchorPosition"
                            anchorPosition={{ top: anchorEl ? anchorEl.getBoundingClientRect().bottom : 0, left: anchorEl ? anchorEl.getBoundingClientRect().left : 0 }}
                        >
                            <MenuItem onClick={handleShare}>Share</MenuItem>
                            <MenuItem onClick={handleDelete}>Delete</MenuItem>
                        </Menu>
                    </div>

                }
            />
            <CardContent>
            <List>
                {notes.map((note, index) => (
                    <EditableNote
                        _id={note._id}
                        key={index}
                        title={note.title}
                        content={note.content!}
                        onUpdate={(newTitle: string, newContent: string) => onUpdateNote(index, newTitle, newContent)}
                        onShare={function (): void {
                            throw new Error('Function not implemented.');
                        } } onDelete={() => deleteNote(note._id)} />
                ))}
                </List>
            </CardContent>
            <Dialog open={openDialog} 
            onClose={handleCloseDialog}
            disableEnforceFocus 
           
            >
                <DialogTitle>Add New Note</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        type="text"
                        fullWidth
                        defaultValue={newNoteTitleRef.current}
                        onChange={(e) => newNoteTitleRef.current = e.target.value}
                    />
                    <TextField
                        margin="dense"
                        id="content"
                        label="Content"
                        type="text"
                        fullWidth
                        defaultValue={newNoteContentRef.current}
                        onChange={(e) => newNoteContentRef.current = e.target.value}
    
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                    setIsCancelClicked(true);
                    handleCloseDialog()
                    }
                        
                        }>Cancel</Button>
                    <Button onClick={handleSaveNote}>Save</Button>
                </DialogActions>
            </Dialog>
            <ShareDialog open={openShareDialog} onClose={handleCloseShareDialog} collectionName={title} collectionId={id}/>
        </Root>
    );
};

export default CollectionObject;
