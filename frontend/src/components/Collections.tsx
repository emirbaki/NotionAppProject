import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // If using React Router for navigation
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import axios, { AxiosResponse } from 'axios'; // Assuming you're using axios for HTTP requests

interface Collection {
  _id: string;
  title: string;
  createdAt: string;
}

const CollectionView: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    // Fetch collections data from your backend API
    const fetchCollections = async () => {
      try {
        const response: AxiosResponse<Collection[]> = await axios.get('http://localhost:3000/collections'); // Adjust endpoint as per your backend setup
        setCollections(response.data);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Collections
      </Typography>
      <Grid container spacing={2}>
        {collections.map(collection => (
          <Grid item xs={12} sm={6} md={4} key={collection._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {collection.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Created on: {new Date(collection.createdAt).toLocaleDateString()}
                </Typography>
                <Button component={Link} to={`/collections/${collection._id}`} variant="contained" color="primary">
                  View Collection
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CollectionView;
