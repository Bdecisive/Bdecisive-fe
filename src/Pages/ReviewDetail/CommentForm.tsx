import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useComment } from '../../Services/CommentService';
import { CommentFormData } from '../../Models/Comment';

interface CommentFormProps {
    reviewId: number;
    onCommentPosted: (reviewId: number) => void;
}

const commentValidation = Yup.object().shape({
    content: Yup.string()
        .required('Comment is required')
        .min(3, 'Comment must be at least 3 characters')
});

const CommentForm: React.FC<CommentFormProps> = ({ reviewId, onCommentPosted }) => {
    const { createComment } = useComment();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CommentFormData>({
        resolver: yupResolver(commentValidation)
    });

    const onSubmit = async (data: CommentFormData) => {
        try {
            const updatedReview = await createComment(reviewId, data);
            onCommentPosted(reviewId);
            reset();
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Add a comment
                </label>
                <textarea
                    {...register('content')}
                    rows={3}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm 
                        ${errors.content 
                            ? 'border-2 border-red-300 focus:border-red-500 focus:ring-red-500' 
                            : 'border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        } 
                        hover:border-gray-400 transition-colors`}
                    placeholder="Write your comment here..."
                />
                {errors.content && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.content.message}
                    </p>
                )}
            </div>
            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={() => reset()}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    Post Comment
                </button>
            </div>
        </form>
    );
};

export default CommentForm;