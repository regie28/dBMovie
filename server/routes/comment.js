/*import { Router } from 'express';
import { Comment } from '../models/CommentModel.js';
import { auth } from '../middleware/auth.js';
const commentRouter = Router();


commentRouter.post('/saveComment', auth, async (req, res) => {
    const comment = new Comment(req.body);

    try {
        await comment.save();
        const result = await Comment.findById(comment._id).populate('writer');
        return res.statusCode(200).json({ success: true, result });
    } catch (err){
        return res.json({ success: false, err});
    }
});

commentRouter.post('/getComments', async (req, res) => {
    try {
      const comments = await Comment.find({ postId: req.body.movieId }).populate('writer');
      return res.status(200).json({ success: true, comments });
    } catch (err) {
      console.error(err);
      return res.status(400).send(err);
    }
  });

  commentRouter.delete('/deleteComment/:id', auth, async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(404).json({ success: false, message: 'Comment not found' });
      }

      // Check if the user trying to delete the comment is the owner of the comment
      if (comment.writer.toString() !== req.user._id) {
        return res.status(401).json({ success: false, message: 'You are not authorized to delete this comment' });
      }

      await comment.remove();
      return res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, err });
    }
  });
export {
  commentRouter
}*/