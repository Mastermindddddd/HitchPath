const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    title: { 
      type: String, 
      default: function() {
        return this.messages.length > 0 ? 
          this.messages[0].text.substring(0, 30) + "..." : 
          "New Chat";
      }
    },
    messages: [
      {
        sender: { type: String, enum: ['user', 'bot'], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  const Chat = mongoose.model('Chat', chatSchema);

  module.exports = Chat;