import express from 'express';
import { rateLimiter, authenticate, validateRequest, trackApiUsage, formatResponse } from '../middleware/apiControl';
import { chatMessageSchema } from '../schemas/validation';
import { supabase } from '@/integrations/supabase/client';

const router = express.Router();

// Apply middleware to all routes in this router
router.use(rateLimiter);
router.use(authenticate);
router.use(trackApiUsage);

// Send a chat message
router.post('/send', validateRequest(chatMessageSchema), async (req, res, next) => {
  try {
    const { message, imageUrl } = req.body;
    const userId = req.user?.id;

    // Store message in Supabase
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([
        {
          user_id: userId,
          message,
          image_url: imageUrl,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Return formatted response
    res.json(formatResponse(data, 'Message sent successfully'));
  } catch (error) {
    next(error);
  }
});

// Get chat history
router.get('/history', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    // Get messages from Supabase
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Return formatted response
    res.json(formatResponse(data, 'Chat history retrieved successfully'));
  } catch (error) {
    next(error);
  }
});

// Delete a message
router.delete('/:messageId', async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id;

    // Delete message from Supabase
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .match({ id: messageId, user_id: userId });

    if (error) throw error;

    // Return formatted response
    res.json(formatResponse(null, 'Message deleted successfully'));
  } catch (error) {
    next(error);
  }
});

export default router; 