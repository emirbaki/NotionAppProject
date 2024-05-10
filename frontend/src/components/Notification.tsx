import React, { useEffect } from 'react';
import { Typography, Paper, IconButton, Button } from '@mui/material';
import { Notification as NotificationModel } from '../utils/Interfaces'; // Assuming you have defined the types for your notification model
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Define props interface for Notification component
interface NotificationProps {
  notification: NotificationModel;
  onAccept: () => void; // Callback function for accepting the notification
  onDecline: () => void; // Callback function for declining the notification
}

// Notification component
const Notification: React.FC<NotificationProps> = ({ notification, onAccept, onDecline }) => {
  return (
    <Paper elevation={3}>
      <Typography variant="h6" gutterBottom>
        Notification
      </Typography>
      <Typography variant="body1">
        Type: {notification.type}
      </Typography>
      {notification.content && (
        <Typography variant="body2" color="textSecondary">
          Content: {notification.content}
        </Typography>
      )}
      <Typography variant="caption" color="textSecondary">
        {notification.read ? 'Read' : 'Unread'}
      </Typography>
      {/* Buttons for accepting and declining notification */}
      <Button onClick={onAccept} variant="contained" color="primary">
        Accept
      </Button>
      <Button onClick={onDecline} variant="contained" color="secondary">
        Decline
      </Button>
    </Paper>
  );
};

interface MyComponentProps {
  username: string | null; // User ID for fetching notifications
}

const NotificationMenu: React.FC<MyComponentProps> = ({ username }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [notifications, setNotifications] = React.useState<NotificationModel[]>([]); // State for user notifications

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:3000/notifications/${username}`); // Example API call
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data); // Update state with fetched notifications
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Handle errors appropriately, e.g., display an error message
    }
  };
  const handleAcceptNotification = (notification: NotificationModel) => {
    // Implement logic to accept the notification
    console.log('Accepted notification:', notification);
    // For example, you might send a request to your backend to process the acceptance
  };
  
  const handleDeclineNotification = (notification: NotificationModel) => {
    // Implement logic to decline the notification
    console.log('Declined notification:', notification);
    // For example, you might send a request to your backend to process the decline
  };
  useEffect(() => {
    fetchNotifications(); // Fetch notifications on component mount
  }, [username]);

  return (
    <div>
      <IconButton aria-controls={anchorEl ? 'notification-menu' : undefined} aria-haspopup="true" onClick={handleClick}>
        <CircleNotificationsIcon />
      </IconButton>
      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'notification-menu-button',
        }}
      >
        {notifications.map((notification) => (
          <MenuItem key={notification._id} onClick={handleClose}>
            {/* Display notification content */}
            <Notification
              notification={notification}
              onAccept={() => handleAcceptNotification(notification)}
              onDecline={() => handleDeclineNotification(notification)}
            />
          </MenuItem>
        ))}
        {notifications.length === 0 && (
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">No notifications</Typography>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default NotificationMenu;
