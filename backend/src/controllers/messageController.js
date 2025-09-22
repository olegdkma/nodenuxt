import { Message } from '../models/Message.js';

export const messageController = {
  // Create a new message
  async create(req, res) {
    try {
      const { content } = req.body;
      
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ 
          error: 'Content is required and cannot be empty' 
        });
      }

      const message = await Message.create(content.trim());
      res.status(201).json({
        success: true,
        message: 'Message created successfully',
        data: message
      });
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  },

  // Get all messages
  async getAll(req, res) {
    try {
      const messages = await Message.findAll();
      res.json({
        success: true,
        count: messages.length,
        data: messages
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  },

  // Get message by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const message = await Message.findById(id);
      
      if (!message) {
        return res.status(404).json({ 
          error: 'Message not found' 
        });
      }

      res.json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Error fetching message:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  },

  // Delete message by ID
  async deleteById(req, res) {
    try {
      const { id } = req.params;
      const result = await Message.deleteById(id);
      
      if (!result.deleted) {
        return res.status(404).json({ 
          error: 'Message not found' 
        });
      }

      res.json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }
};
