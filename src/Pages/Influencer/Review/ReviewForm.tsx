import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { GlobalCategory } from '../../../Models/Category';
import { CreateReviewData, Review } from '../../../Models/Review';
import { useProduct } from '../../../Services/ProductService';
import StarRating from '../../../Components/Rating/StarRating';
import { toast } from 'react-toastify';

interface ReviewFormProps {
  categories: GlobalCategory[];
  onSubmit: (data: CreateReviewData) => Promise<void>;
  initialData?: Review | null;
}

const reviewValidation = Yup.object().shape({
  categoryId: Yup.number().required('Category is required'),
  productId: Yup.number().required('Product is required'),
  rating: Yup.number()
    .required('Rating is required')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot be more than 5'),
  details: Yup.string()
    .required('Review details are required')
    .min(10, 'Details must be at least 10 characters')
});

const ReviewForm: React.FC<ReviewFormProps> = ({
  categories,
  onSubmit,
  initialData
}) => {
  const { products, fetchProductsByCategory } = useProduct();
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateReviewData>({
    resolver: yupResolver(reviewValidation),
    defaultValues: initialData ? {
      categoryId: initialData.category.id,
      productId: initialData.product.id,
      rating: initialData.rating,
      details: initialData.details
    } : {
      categoryId: 0,
      productId: 0,
      rating: 0,
      details: ''
    }
  });

  // Initial load for edit mode
  useEffect(() => {
    const loadInitialProducts = async () => {
      if (initialData?.category.id) {
        setIsLoadingProducts(true);
        try {
          await fetchProductsByCategory(initialData.category.id);
          // Set the product value after products are loaded
          setValue('productId', initialData.product.id);
        } catch (error) {
          console.error('Error loading initial products:', error);
        }
        setIsLoadingProducts(false);
      }
    };

    loadInitialProducts();
  }, [initialData]);

  const selectedCategoryId = watch('categoryId');

  // Handle category change
  useEffect(() => {
    const loadProducts = async () => {
      if (selectedCategoryId && selectedCategoryId !== 0) {
        setIsLoadingProducts(true);
        try {
          await fetchProductsByCategory(selectedCategoryId);
          // Reset product selection if changing category
          if (!initialData || initialData.category.id !== selectedCategoryId) {
            setValue('productId', 0);
          }
        } catch (error) {
          console.error('Error loading products:', error);
        }
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, [selectedCategoryId]);

  const onSubmitForm = async (data: CreateReviewData) => {
    try {
      console.log('Form submitted with data:', data);
      console.log('Form errors:', errors);
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6" noValidate>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          {...register('categoryId', { valueAsNumber: true })}  // Add valueAsNumber
          onChange={(e) => {
            register('categoryId', { valueAsNumber: true }).onChange(e);
            if (e.target.value) {
              fetchProductsByCategory(Number(e.target.value));
            }
          }}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.categoryId ? 'border-red-300' : 'border-gray-300'
            }`}
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product
        </label>
        <select
          {...register('productId', { valueAsNumber: true })}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.productId ? 'border-red-300' : 'border-gray-300'
            }`}
          disabled={!selectedCategoryId || isLoadingProducts}
        >
          <option value="">
            {isLoadingProducts
              ? 'Loading products...'
              : selectedCategoryId
                ? 'Select a product'
                : 'Please select a category first'}
          </option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        {errors.productId && (
          <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Rating
        </label>
        <Controller
          name="rating"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="mt-2">
              <StarRating value={value} onChange={onChange} size={32} />
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Review Details
        </label>
        <textarea
          {...register('details')}
          rows={4}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.details ? 'border-red-300' : 'border-gray-300'
            }`}
          placeholder="Write your review details here..."
        />
        {errors.details && (
          <p className="mt-1 text-sm text-red-600">{errors.details.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;