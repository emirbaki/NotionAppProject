// import React from 'react';
// import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';
// import { Notification as NotificationModel } from './types'; // Assuming you have defined the types for your notification model

// // Define styles using Material-UI makeStyles
// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       padding: theme.spacing(2),
//       marginBottom: theme.spacing(2),
//     },
//   }),
// );

// // Define props interface for Notification component
// interface NotificationProps {
//   notification: NotificationModel;
// }

// // Notification component
// const Notification: React.FC<NotificationProps> = ({ notification }) => {
//   const classes = useStyles();

//   return (
//     <Paper elevation={3} className={classes.root}>
//       <Typography variant="h6" gutterBottom>
//         Notification
//       </Typography>
//       <Typography variant="body1">
//         Type: {notification.type}
//       </Typography>
//       {notification.content && (
//         <Typography variant="body2" color="textSecondary">
//           Content: {notification.content}
//         </Typography>
//       )}
//       <Typography variant="caption" color="textSecondary">
//         {notification.read ? 'Read' : 'Unread'}
//       </Typography>
//     </Paper>
//   );
// };

// export default Notification;
