import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: String, required: true }, // User's username
    recipient: { type: String, required: true }, // R
    type: { type: String, required: true }, // e.g., 'friend_request', 'note_shared'
    content: { type: String }, // Optional: Content of the notification
    read: { type: Boolean, default: false },
    sharingInstanceId: {type: String, required: true}
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;