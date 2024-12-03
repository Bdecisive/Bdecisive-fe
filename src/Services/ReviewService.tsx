import { useState } from "react";
import { buildUrl, ENDPOINTS } from "../Config/endpoints";
import { CreateReviewData, Review } from "../Models/Review";
import { useSpinnerAction } from "../Utils/useSpinnerAction";
import { api } from "./ApiService";
import { toast } from "react-toastify";

export const ReviewService = {
  async getReviewsByProduct(productId: number): Promise<Review[]> {
    const response = await api.get(buildUrl(ENDPOINTS.REVIEW.PRODUCT_LIST(productId)));
    return response.data;
  },

  async getPublicReviews(): Promise<Review[]> {
    const response = await api.get(buildUrl(ENDPOINTS.REVIEW.LIST));
    return response.data;
  },

  async getReviewsByCategory(categoryId: number): Promise<Review[]> {
    const response = await api.get(buildUrl(ENDPOINTS.REVIEW.CATEGORY_LIST(categoryId)));
    return response.data;
  },

  async getReviewsByUser(userId: number): Promise<Review[]> {
    const response = await api.get(buildUrl(ENDPOINTS.REVIEW.USER_LIST(userId)));
    return response.data;
  },

  async createReview(data: CreateReviewData): Promise<void> {
    const response = await api.post(buildUrl(ENDPOINTS.REVIEW.CREATE), data);
    return response.data;
  },

  async updateReview(reviewId: number, data: CreateReviewData): Promise<void> {
    const response = await api.put(buildUrl(ENDPOINTS.REVIEW.UPDATE(reviewId)), data);
    return response.data;
  },

  async deleteReview(reviewId: number): Promise<void> {
    const response = await api.delete(buildUrl(ENDPOINTS.REVIEW.DELETE(reviewId)));
    return response.data;
  },

  async getReviewById(reviewId: number): Promise<Review> {
    const response = await api.get(buildUrl(ENDPOINTS.REVIEW.GET_REVIEW(reviewId)));
    return response.data;
  },

  async likeReview(reviewId: number): Promise<Review> {
    const response = await api.post(buildUrl(ENDPOINTS.REVIEW.LIKE(reviewId)));
    return response.data;
  },

  async unlikeReview(reviewId: number): Promise<Review> {
    const response = await api.post(buildUrl(ENDPOINTS.REVIEW.UNLIKE(reviewId)));
    return response.data;
  },
};

export const useReview = () => {
  const withSpinner = useSpinnerAction();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [review, setReview] = useState<Review | null>(null);

  const fetchReviewsByProduct = async (productId: number) => {
    await withSpinner(async () => {
      try {
        const response = await ReviewService.getReviewsByProduct(productId);
        setReviews(response);
      } catch (error) {
        toast.error('Failed to fetch reviews');
        console.error('Error fetching reviews:', error);
        throw error;
      }
    });
  };

  const fetchReviewsByCategory = async (categoryId: number) => {
    await withSpinner(async () => {
      try {
        const response = await ReviewService.getReviewsByCategory(categoryId);
        setReviews(response);
      } catch (error) {
        toast.error('Failed to fetch reviews');
        console.error('Error fetching reviews:', error);
        throw error;
      }
    });
  };

  const fetchReviewsByUser = async (userId: number) => {
    await withSpinner(async () => {
      try {
        const response = await ReviewService.getReviewsByUser(userId);
        setReviews(response);
      } catch (error) {
        toast.error('Failed to fetch user reviews');
        console.error('Error fetching user reviews:', error);
        throw error;
      }
    });
  };

  const createReview = async (data: CreateReviewData) => {
    await withSpinner(async () => {
      try {
        await ReviewService.createReview(data);
        toast.success('Review submitted successfully');
        if (data.productId) {
          await fetchReviewsByProduct(data.productId);
        }
      } catch (error) {
        toast.error('Failed to submit review');
        console.error('Error creating review:', error);
        throw error;
      }
    });
  };

  const updateReview = async (reviewId: number, data: CreateReviewData) => {
    await withSpinner(async () => {
      try {
        await ReviewService.updateReview(reviewId, data);
        toast.success('Review updated successfully');
        if (data.productId) {
          await fetchReviewsByProduct(data.productId);
        }
      } catch (error) {
        toast.error('Failed to update review');
        console.error('Error updating review:', error);
        throw error;
      }
    });
  };

  const deleteReview = async (reviewId: number, productId: number) => {
    await withSpinner(async () => {
      try {
        await ReviewService.deleteReview(reviewId);
        toast.success('Review deleted successfully');
        await fetchReviewsByProduct(productId);
      } catch (error) {
        toast.error('Failed to update review');
        console.error('Error updating review:', error);
        throw error;
      }
    });
  }

  const fetchPublicReviews = async () => {
    await withSpinner(async () => {
      try {
        const response = await ReviewService.getPublicReviews();
        setReviews(response);
      } catch (error) {
        toast.error('Failed to fetch reviews');
        throw error;
      }
    });
  };

  const getReviewById = async (reviewId: number): Promise<Review> => {
    return await withSpinner(async () => {
      try {
        const response = await ReviewService.getReviewById(reviewId);
        setReview(response);
        return response;
      } catch (error) {
        throw error;
      }
    });
  };

  const likeReview = async (reviewId: number): Promise<Review> => {
    return await withSpinner(async () => {
      try {
        const response = await ReviewService.likeReview(reviewId);
        setReview(response);
        return response;
      } catch (error) {
        throw error;
      }
    });
  };

  const unlikeReview = async (reviewId: number): Promise<Review> => {
    return await withSpinner(async () => {
      try {
        const response = await ReviewService.unlikeReview(reviewId);
        setReview(response);
        return response;
      } catch (error) {
        throw error;
      }
    });
  };


  return {
    reviews,
    createReview,
    updateReview,
    deleteReview,
    fetchReviewsByProduct,
    fetchReviewsByCategory,
    fetchReviewsByUser,
    fetchPublicReviews,
    getReviewById,
    likeReview,
    unlikeReview,
  };
};