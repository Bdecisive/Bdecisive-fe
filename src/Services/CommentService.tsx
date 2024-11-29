import axios from "axios";
import { CommentGet, CommentPost } from "../Models/Comment";
import { handleError } from "../Helpers/ErrorHandler";
import { api } from "./ApiService";

export const commentPostAPI = async (
  title: string,
  content: string,
  symbol: string
) => {
  try {
    const data = await axios.post<CommentPost>(api + `${symbol}`, {
      title: title,
      content: content,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const commentGetAPI = async (symbol: string) => {
  try {
    const data = await axios.get<CommentGet[]>(api + `?Symbol=${symbol}`);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const useComment = () => {
  const createComment = async (reviewId: number, data: { content: string }) => {
    const response = await api.post(`/api/reviews/${reviewId}/comments`, data);
    return response.data;
  };

  return {
    createComment
  };
};