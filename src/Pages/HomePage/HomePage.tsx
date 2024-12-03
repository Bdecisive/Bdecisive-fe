// src/Pages/HomePage/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { useReview } from '../../Services/ReviewService';
import { useCategory } from '../../Services/CategoryService';
import StarRating from '../../Components/Rating/StarRating';
import { Review } from '../../Models/Review';
import { Search } from 'lucide-react';
import ReviewDetail from '../ReviewDetail/ReviewDetailPage';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { reviews, fetchPublicReviews } = useReview();
  const { categories, fetchGlobalCategories } = useCategory();

  useEffect(() => {
    fetchPublicReviews();
    fetchGlobalCategories();
  }, []);

  // Filter reviews based on search and category
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchTerm === '' ||
      review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === null ||
      review.category.id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Product Reviews & Experiences
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover honest reviews from our community and share your own experiences
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search reviews by product name or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Categories Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedCategory === null
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="flex-1">
            {filteredReviews.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredReviews.map((review) => (
                  <div
                    onClick={() => navigate(`/reviews/${review.id}`)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {review.product.name}
                          </h2>
                          <span className="inline-block mt-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                            {review.category.name}
                          </span>
                        </div>
                        <StarRating value={review.rating} readOnly size={20} />
                      </div>

                      <p className="text-gray-600 line-clamp-3">{review.details}</p>

                      <div className="mt-4 flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {review.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span className="text-sm text-gray-600">{review.name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                          <div className="flex items-center">
                            <span className="font-medium">{review.comments?.length || 0}</span>
                            <span className="ml-1">comments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="text-gray-400">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "No reviews match your search criteria"
                    : "Be the first to write a review!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;