// pages/VendorPage/VendorPage.tsx
import React, { useEffect, useState } from 'react';
import { Modal, ModalFooter, ModalHeader } from '../../Components/Modal';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import Pagination from '../../Components/Pagination/Pagination';
import { Vendor } from '../../Models/Vendor';
import { useVendor } from '../../Services/VendorService';

const VendorPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const ITEMS_PER_PAGE = 10;

  const { vendors, fetchVendors, approveVendor, deleteVendor } = useVendor();

  // Initial fetch
  useEffect(() => {
    fetchVendors();
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

  // Calculate counts for each tab
  const pendingVendors = vendors.filter(vendor => !vendor.approvedDate);
  const historyVendors = vendors.filter(vendor => !!vendor.approvedDate);

  // Filter vendors based on approval status and search term
  const filteredVendors = (activeTab === 0 ? pendingVendors : historyVendors)
    .filter(vendor => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        vendor.firstName.toLowerCase().includes(searchLower) ||
        vendor.lastName.toLowerCase().includes(searchLower) ||
        vendor.email.toLowerCase().includes(searchLower) ||
        vendor.companyName.toLowerCase().includes(searchLower)
      );
    });

  // Pagination
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApprove = (vendor: Vendor) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Approve Vendor',
      message: `Are you sure you want to approve vendor ${vendor.companyName}?`,
      confirmText: 'Approve',
      confirmButtonClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      onConfirm: async () => {
        try {
          // Add your approve API call here
          console.log('Approving vendor:', vendor.id);
          // After successful approval, you might want to refresh your data
        } catch (error) {
          console.error('Error approving vendor:', error);
        }
      }
    });
  };

  const handleReject = (vendor: Vendor) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reject',
      message: `Are you sure you want to Reject vendor ${vendor.companyName}? This action cannot be undone.`,
      confirmText: 'Reject',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      onConfirm: async () => {
        try {
          // Add your reject API call here
          console.log('Deleting vendor:', vendor.id);
          // After successful deletion, you might want to refresh your data
        } catch (error) {
          console.error('Error deleting vendor:', error);
        }
      }
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your vendors and their status
            </p>
          </div>
        </div>

        {/* Search and Tabs */}
        <div className="mb-6">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search vendors..."
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
              <button
                onClick={() => {
                  setActiveTab(0);
                  setCurrentPage(1);
                }}
                className={`${activeTab === 0
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Pending ({pendingVendors.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab(1);
                  setCurrentPage(1);
                }}
                className={`${activeTab === 1
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                History ({historyVendors.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                {activeTab !== 0 && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                )}
                {activeTab !== 0 && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved Date</th>
                )}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {vendor.firstName[0]}{vendor.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {vendor.firstName} {vendor.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{vendor.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vendor.companyName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vendor.email}</div>
                    <div className="text-sm text-gray-500">{vendor.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </td>
                  {activeTab !== 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`mt-1 inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${vendor.isApproved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {vendor?.isApproved ? 'Approved' : 'Rejected'}
                      </span>
                    </td>
                  )}
                  {activeTab !== 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vendor.approvedDate && new Date(vendor.approvedDate).toLocaleDateString()}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-3 justify-end">
                      <button
                        onClick={() => setSelectedVendor(vendor)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        View
                      </button>
                      {!vendor.approvedDate && (
                        <button
                          onClick={() => handleApprove(vendor)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleReject(vendor)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {filteredVendors.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredVendors.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}

          {/* Empty State */}
          {filteredVendors.length === 0 && (
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No vendors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "No vendors match your search criteria."
                  : activeTab === 0
                    ? "No pending vendors at the moment."
                    : "No approved vendors at the moment."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Vendor Details Modal */}
      <Modal isOpen={!!selectedVendor} onClose={() => setSelectedVendor(null)}>
        {selectedVendor && (
          <>
            <ModalHeader title="Vendor Details" onClose={() => setSelectedVendor(null)} />
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedVendor.companyName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                <p className="mt-1 text-sm text-gray-900">{selectedVendor.firstName} {selectedVendor.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{selectedVendor.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <p className="mt-1 text-sm text-gray-900">{selectedVendor.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="mt-1 text-sm text-gray-900">{selectedVendor.address || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`mt-1 inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${selectedVendor.approvedDate
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {selectedVendor.approvedDate ? 'Approved' : 'Pending'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Created At</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedVendor.createdAt).toLocaleDateString()}
                </p>
              </div>
              {selectedVendor.approvedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Approved Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedVendor.approvedDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            <ModalFooter onClose={() => setSelectedVendor(null)}>
              {!selectedVendor.approvedDate && (
                <button
                  type="button"
                  onClick={() => {
                    handleApprove(selectedVendor);
                    setSelectedVendor(null);
                  }}
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Approve Vendor
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  handleReject(selectedVendor);
                  setSelectedVendor(null);
                }}
                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Reject
              </button>
            </ModalFooter>
          </>
        )}
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

export default VendorPage;