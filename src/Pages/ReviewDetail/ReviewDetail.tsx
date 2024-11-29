import React, { useState } from 'react';
import { Review } from '../../Models/Review';
import { useAuth } from '../../Context/useAuth';
import CommentForm from './CommentForm';
import { Modal, ModalHeader } from '../../Components/Modal';
import StarRating from '../../Components/Rating/StarRating';

interface ReviewDetailProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({ review, isOpen, onClose }) => {
  const { user } = useAuth();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <ModalHeader title="Review Details" onClose={onClose} />
        
        {/* Review Content */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{review.product.name}</h3>
                <p className="text-sm text-gray-500">{review.category.name}</p>
              </div>
              <StarRating value={review.rating} readOnly size={20} />
            </div>
            <p className="mt-4 text-gray-700">{review.details}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Comments</h4>
            {review.comments && review.comments.length > 0 ? (
              <div className="space-y-4">
                {review.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{comment.content}</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span>{comment.userName}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No comments yet</p>
            )}
          </div>

          {/* Comment Form */}
          {user && <CommentForm reviewId={review.id} />}
        </div>
      </div>
    </Modal>
  );
};

export default ReviewDetail;