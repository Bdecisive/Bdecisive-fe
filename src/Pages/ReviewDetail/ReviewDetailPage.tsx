import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/useAuth';
import { useReview } from '../../Services/ReviewService';
import { Review } from '../../Models/Review';
import StarRating from '../../Components/Rating/StarRating';
import CommentForm from './CommentForm';
import { getErrorMessage } from '../../Services/ApiService';

const ReviewDetailPage = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getReviewById, likeReview, unlikeReview } = useReview();

  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewId) return;
  
      try {
        setIsLoading(true);
        setError(null);
        const data = await getReviewById(Number(reviewId));
        setReview(data);
        // Update this line to match backend property name
        setIsLiked(data.likedByUser || false);  // Changed from isLikedByUser to likedByUser
        setLikeCount(data.likeCount || 0);
      } catch (error) {
        setError('Failed to load review');
        toast.error('Failed to load review');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchReview();
  }, [reviewId]);

  const handleLikeClick = async () => {
    if (!user) {
      toast.error('Please login to like reviews');
      return;
    }

    if (!review) return;

    try {
      if (isLiked) {
        await unlikeReview(review.id);
        setLikeCount(prev => prev - 1);
      } else {
        await likeReview(review.id);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !review || !review.product || !review.category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {error || 'Review not found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Reviews
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{review.product.name}</h1>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                    {review.category.name}
                  </span>
                  <StarRating value={review.rating} readOnly size={20} />
                </div>
              </div>

              {/* Like Button */}
              <button
                onClick={handleLikeClick}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${isLiked
                  ? 'text-red-500 bg-red-50 hover:bg-red-100'
                  : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
                  }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-medium">{likeCount}</span>
              </button>
            </div>

            {/* Review Meta */}
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {review.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="ml-2">{review.name || 'Anonymous'}</span>
              </div>
              <span className="mx-2">•</span>
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Review Content */}
          <div className="p-6">
            <p className="text-gray-700 whitespace-pre-line">{review.details}</p>
          </div>

          {/* Comments Section */}
          <div className="border-t">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Comments ({review.comments?.length || 0})
                </h2>
                <MessageCircle className="w-5 h-5 text-gray-400" />
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {review.comments && review.comments.length > 0 ? (
                  review.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {comment.userName?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-4">
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">{comment.userName}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-700">{comment.content}</div>
                        <div className="mt-2 text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>

              {/* Comment Form */}
              {user ? (
                <div className="mt-6">
                  <CommentForm reviewId={review.id} />
                </div>
              ) : (
                <div className="mt-6 text-center py-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    Please{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      login
                    </button>
                    {' '}to leave a comment
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;