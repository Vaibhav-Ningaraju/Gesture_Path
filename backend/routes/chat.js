const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// TODO: Replace with your actual database models
// const Chat = require('../models/Chat');
// const Message = require('../models/Message');

// Mock data for development
const mockChats = [];
const mockMessages = [];

// GET /api/chat - Get all chats for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // TODO: Fetch chats from database
    // const chats = await Chat.find({ userId })
    //   .sort({ updatedAt: -1 })
    //   .populate('messages');

    // Mock implementation
    const userChats = mockChats
      .filter(chat => chat.userId === userId)
      .map(chat => ({
        ...chat,
        messages: mockMessages.filter(msg => msg.chatId === chat.id)
      }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json(userChats);

  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// POST /api/chat - Create new chat
router.post('/', [
  auth,
  body('title').isLength({ min: 1 }).withMessage('Title is required'),
  body('inputMode').isIn(['visual', 'audio', 'text']).withMessage('Invalid input mode'),
  body('outputMode').isIn(['visual', 'audio', 'text']).withMessage('Invalid output mode'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { title, inputMode, outputMode } = req.body;

    // TODO: Save to database
    // const chat = new Chat({
    //   title,
    //   userId,
    //   inputMode,
    //   outputMode,
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // });
    // await chat.save();

    // Mock implementation
    const chat = {
      id: Date.now().toString(),
      title,
      userId,
      inputMode,
      outputMode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    mockChats.push(chat);

    res.status(201).json(chat);

  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// GET /api/chat/:id - Get specific chat
router.get('/:id', auth, async (req, res) => {
  try {
    const chatId = req.params.id;
    const userId = req.user.userId;

    // TODO: Fetch from database
    // const chat = await Chat.findOne({ _id: chatId, userId })
    //   .populate('messages');

    // Mock implementation
    const chat = mockChats.find(c => c.id === chatId && c.userId === userId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const chatWithMessages = {
      ...chat,
      messages: mockMessages.filter(msg => msg.chatId === chatId)
    };

    res.json(chatWithMessages);

  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});

// DELETE /api/chat/:id - Delete chat
router.delete('/:id', auth, async (req, res) => {
  try {
    const chatId = req.params.id;
    const userId = req.user.userId;

    // TODO: Delete from database
    // await Message.deleteMany({ chatId });
    // const deletedChat = await Chat.findOneAndDelete({ _id: chatId, userId });

    // Mock implementation
    const chatIndex = mockChats.findIndex(c => c.id === chatId && c.userId === userId);
    if (chatIndex === -1) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    mockChats.splice(chatIndex, 1);
    // Remove associated messages
    const messageIndicesToRemove = [];
    mockMessages.forEach((msg, index) => {
      if (msg.chatId === chatId) {
        messageIndicesToRemove.push(index);
      }
    });
    messageIndicesToRemove.reverse().forEach(index => {
      mockMessages.splice(index, 1);
    });

    res.json({ message: 'Chat deleted successfully' });

  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

// POST /api/chat/:id/messages - Add message to chat
router.post('/:id/messages', [
  auth,
  body('content').notEmpty().withMessage('Content is required'),
  body('role').isIn(['user', 'assistant']).withMessage('Invalid role'),
  body('type').optional().isIn(['text', 'audio', 'visual']).withMessage('Invalid type'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const chatId = req.params.id;
    const userId = req.user.userId;
    const { content, role, type, metadata } = req.body;

    // Verify chat exists and belongs to user
    const chat = mockChats.find(c => c.id === chatId && c.userId === userId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // TODO: Save message to database
    // const message = new Message({
    //   chatId,
    //   content,
    //   role,
    //   type,
    //   metadata,
    //   timestamp: new Date()
    // });
    // await message.save();

    // Mock implementation
    const message = {
      id: Date.now().toString(),
      chatId,
      content,
      role,
      type: type || 'text',
      metadata: metadata || {},
      timestamp: new Date().toISOString()
    };
    mockMessages.push(message);

    // Update chat's updatedAt timestamp
    chat.updatedAt = new Date().toISOString();

    res.status(201).json(message);

  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

module.exports = router;