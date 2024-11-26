import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Category, CreateCategoryData } from '../../../Models/Category';
import { useCategory } from '../../../Services/CategoryService';
import { FieldMapping, handleServerErrors } from '../../../Utils/formUtils';
import Pagination from '../../../Components/Pagination/Pagination';
import { Modal, ModalFooter, ModalHeader } from '../../../Components/Modal';
import ConfirmationModal from '../../ConfirmationModal/ConfirmationModal';
import { formatDate, formatDateTime } from '../../../Utils/DateHelper';

const AdminCategoryPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const { categories, fetchCategories, createCategory, approveCategory, rejectCategory } = useCategory();

  useEffect(() => {
    fetchCategories();
  }, []);

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

  // Filter categories based on approval status and search term
  const filteredCategories = categories
    .filter(category => activeTab === 0 && !category.approved ? !category.approvedDate : !!category.approvedDate)
    .filter(category => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        category.name.toLowerCase().includes(searchLower) ||
        category.description.toLowerCase().includes(searchLower) ||
        category.companyName.toLowerCase().includes(searchLower) ||
        category.vendorName.toLowerCase().includes(searchLower)
      );
    });

  // Create form validation schema
  const createCategoryValidation = Yup.object().shape({
    name: Yup.string().required("Category name is required"),
    description: Yup.string().required("Description is required"),
  });

  // Form handling for create category
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    formState: { errors: createErrors },
    reset: resetCreateForm,
    setError
  } = useForm<CreateCategoryData>({
    resolver: yupResolver(createCategoryValidation)
  });

  const fieldMapping: FieldMapping<CreateCategoryData> = {
    name: 'name',
    description: 'description'
  };

  const handleCreateCategory = async (data: CreateCategoryData) => {
    try {
      await createCategory(data);
      setIsCreateModalOpen(false);
      resetCreateForm();
      await fetchCategories();
    } catch (error: any) {
      const serverError = error.response?.data;

      if (serverError?.message.includes('already exists')) {
        setError('name', {
          type: 'manual',
          message: serverError.message
        });
      } else {
        toast.error(serverError?.message || 'An unexpected error occurred');
      }
    }
  };

  // Calculate counts for tabs
  const activeCount = categories.filter(category => category.approved).length;
  const historyCount = categories.filter(category => !!category.approvedDate).length;

  // Get paginated data
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleApprove = (category: Category) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Approve Category',
      message: `Are you sure you want to approve category "${category.name}"?`,
      confirmText: 'Approve',
      confirmButtonClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      onConfirm: async () => {
        await approveCategory(category.id);
      }
    });
  };

  const handleReject = (category: Category) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reject Category',
      message: `Are you sure you want to reject category "${category.name}"?`,
      confirmText: 'Reject',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      onConfirm: async () => {
        await rejectCategory(category.id);
      }
    });
  };

  const getCategoryStatus = (category: Category) => {
    // If approvedDate is null -> Pending
    if ((!category.approvedDate || category.approvedDate === "null") && !category.approved) {
      return {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800'
      };
    }

    // If approved is true -> Approved
    if (category.approved) {
      return {
        label: 'Approved',
        className: 'bg-green-100 text-green-800'
      };
    }

    // If approvedDate exists but approved is false -> Rejected
    return {
      label: 'Rejected',
      className: 'bg-red-100 text-red-800'
    };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage vendor category submissions
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Category
          </button>
        </div>

        {/* Search and Tabs */}
        <div className="mb-6">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['Active', 'History'].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(index);
                    setCurrentPage(1);
                  }}
                  className={`${activeTab === index
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab} ({index === 0 ? activeCount : historyCount})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab !== 0 ? 'Submitted Date' : 'Approved Date'}
                </th>
                {activeTab !== 0 && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                )}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{category.vendorName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{category.companyName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activeTab !== 0
                      ? formatDate(category.createdAt)
                      : formatDate(category.approvedDate)
                    }
                  </td>
                  {activeTab !== 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`mt-1 inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getCategoryStatus(category).className}`}>
                        {getCategoryStatus(category).label}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-3 justify-end">
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        View
                      </button>
                      {activeTab !== 0 && (
                        <button
                          onClick={() => handleApprove(category)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {activeTab !== 0 && (
                        <button
                          onClick={() => handleReject(category)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {filteredCategories.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredCategories.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "No categories match your search criteria."
                  : activeTab === 0
                    ? "No active categories at the moment."
                    : "No history categories at the moment."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Category Details Modal */}
      <Modal isOpen={!!selectedCategory} onClose={() => setSelectedCategory(null)}>
        {selectedCategory && (
          <>
            <ModalHeader title="Category Details" onClose={() => setSelectedCategory(null)} />
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCategory.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCategory.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCategory.vendorName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCategory.companyName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1 text-sm text-gray-900">
                  <span className={`mt-1 inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getCategoryStatus(selectedCategory).className}`}>
                    {getCategoryStatus(selectedCategory).label}
                  </span>
                </p>
              </div>

              {selectedCategory.approvedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Approved Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDateTime(selectedCategory.approvedDate)}
                  </p>
                </div>
              )}

            </div>
            <ModalFooter onClose={() => setSelectedCategory(null)}>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* Create Category Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => {
        setIsCreateModalOpen(false);
        resetCreateForm();
      }}>
        <div className="p-6">
          <ModalHeader
            title="Create New Category"
            onClose={() => {
              setIsCreateModalOpen(false);
              resetCreateForm();
            }}
          />
          <form onSubmit={handleCreateSubmit(handleCreateCategory)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Category Name
              </label>
              <input
                type="text"
                id="name"
                {...registerCreate("name")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${createErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
              />
              {createErrors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {createErrors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                {...registerCreate("description")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${createErrors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
              />
              {createErrors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {createErrors.description.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetCreateForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>
      </Modal>

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

export default AdminCategoryPage;