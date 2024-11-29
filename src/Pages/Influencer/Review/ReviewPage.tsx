import { useEffect, useState } from "react";
import { useCategory } from "../../../Services/CategoryService";
import { Tab } from "../../../Models/Tab";
import { CreateReviewData, Review } from "../../../Models/Review";
import { useReview } from "../../../Services/ReviewService";
import StarRating from "../../../Components/Rating/StarRating";
import ReviewForm from "./ReviewForm";
import { useAuth } from "../../../Context/useAuth";
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";

const ReviewPage = () => {
  const { user } = useAuth();
  const [tabs, setTabs] = useState<Tab[]>([{ id: 'list', label: 'Reviews', type: 'list' }]);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const { categories, fetchGlobalCategories } = useCategory();
  const { reviews, createReview, updateReview, deleteReview, fetchReviewsByUser } = useReview();

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText: string;
    confirmButtonClass: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    confirmText: '',
    confirmButtonClass: ''
  });

  useEffect(() => {
    fetchGlobalCategories();
    if (user?.id) {
      fetchReviewsByUser(user.id);
    }
  }, []);

  const handleNewReview = () => {
    setSelectedReview(null);
    const newTabId = `new-review-${Date.now()}`;
    setTabs([...tabs, { id: newTabId, label: 'New Review', type: 'form' }]);
    setActiveTab(newTabId);
  };

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    const editTabId = `edit-review-${Date.now()}`;
    setTabs([...tabs, { id: editTabId, label: 'Edit Review', type: 'form' }]);
    setActiveTab(editTabId);
  };

  const handleDeleteReview = (review: Review) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Review',
      message: 'Are you sure you want to delete this review?',
      confirmText: 'Delete',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      onConfirm: async () => {
        try {
          await deleteReview(review.id, review.product.id);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          if (user?.id) {
            await fetchReviewsByUser(user.id);
          }
        } catch (error) {
          console.error('Error deleting review:', error);
        }
      }
    });
  };

  const handleSubmitReview = async (data: CreateReviewData) => {
    try {
      if (selectedReview) {
        await updateReview(selectedReview.id, data);
      } else {
        await createReview(data);
      }
      
      // Close the form tab and refresh reviews
      const newTabs = tabs.filter(tab => tab.id === 'list');
      setTabs(newTabs);
      setActiveTab('list');
      setSelectedReview(null);
      
      if (user?.id) {
        await fetchReviewsByUser(user.id);
      }
    } catch (error) {
      // Error handling is done in the service
    }
  };

  const closeTab = (tabId: string) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    if (activeTab === tabId) {
      setActiveTab('list');
      setSelectedReview(null);
    }
  };

  const renderReviewList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <button
          onClick={handleNewReview}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Review
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="px-6 py-4">{review.product.name}</td>
                <td className="px-6 py-4">{review.category.name}</td>
                <td className="px-6 py-4">
                  <StarRating value={review.rating} readOnly size={20} />
                </td>
                <td className="px-6 py-4">{review.details}</td>
                <td className="px-6 py-4">
                  {new Date(review.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-3 justify-end">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <div key={tab.id} className="relative">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  {tab.label}
                  {tab.id !== 'list' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                      className="ml-2 text-gray-400 hover:text-gray-500"
                    >
                      ×
                    </button>
                  )}
                </button>
              </div>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'list' ? (
            renderReviewList()
          ) : (
            <ReviewForm
              categories={categories}
              onSubmit={handleSubmitReview}
              initialData={selectedReview}
            />
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        confirmButtonClass={confirmDialog.confirmButtonClass}
      />
    </div>
  );
};

export default ReviewPage;