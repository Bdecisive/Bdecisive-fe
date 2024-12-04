import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { api } from "./ApiService";
import { buildUrl, ENDPOINTS } from "../Config/endpoints";
import { useSpinnerAction } from "../Utils/useSpinnerAction";
import { toast } from "react-toastify";
import { CommentFormData } from "../Models/Comment";

export const CommentService = {
  async createComment(reviewId: number, data: CommentFormData): Promise<Comment> {
    try {
        const response = await api.post(buildUrl(ENDPOINTS.COMMENT.CREATE(reviewId)), data);
        return response.data;
    } catch (error) {
        throw error;
    }
},
}

export const useComment = () => {
  const withSpinner = useSpinnerAction();

  const createComment = async (reviewId: number, data: CommentFormData) => {
    await withSpinner(async () => {
        try {
            await CommentService.createComment(reviewId, data);
            toast.success('Comment created successfully');
        } catch (error) {
            toast.error('Failed to create comment');
            console.error('Error creating comment:', error);
            throw error;
        }
    });
};

  return {
    createComment
  };
};