import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // e.g., 'friend_request', 'note_shared'
    content: { type: String }, // Optional: Content of the notification
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;