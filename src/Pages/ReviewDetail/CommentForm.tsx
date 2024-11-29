import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useComment } from '../../Services/CommentService';

interface CommentFormProps {
    reviewId: number;
}

interface CommentFormData {
    content: string;
}

const commentValidation = Yup.object().shape({
    content: Yup.string()
        .required('Comment is required')
        .min(3, 'Comment must be at least 3 characters')
});

const CommentForm: React.FC<CommentFormProps> = ({ reviewId }) => {
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
            await createComment(reviewId, data);
            reset(); // Clear form after successful submission
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <div>
                <label htmlFor="comment" className="sr-only">
                    Add a comment
                </label>
                <textarea
                    {...register('content')}
                    rows={3}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.content ? 'border-red-300' : ''
                        }`}
                    placeholder="Add a comment..."
                />
                {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
            </div>
            <div className="mt-2 flex justify-end">
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Post Comment
                </button>
            </div>
        </form>
    );
};

export default CommentForm;