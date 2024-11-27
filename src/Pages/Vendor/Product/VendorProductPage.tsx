import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Modal, ModalHeader } from '../../../Components/Modal';
import Pagination from '../../../Components/Pagination/Pagination';
import { SaveProductData, Product } from '../../../Models/Product';
import { useCategory } from '../../../Services/CategoryService';
import { useProduct } from '../../../Services/ProductService';
import { FieldMapping, handleServerErrors } from '../../../Utils/formUtils';
import ConfirmationModal from '../../ConfirmationModal/ConfirmationModal';
import { useAuth } from '../../../Context/useAuth';

const productValidation = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number()
        .required('Price is required')
        .min(0, 'Price must be greater than or equal to 0'),
    categoryId: Yup.string().required('Category is required'),
});

const ProductPage = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const ITEMS_PER_PAGE = 10;

    const { products, fetchProductsByVendor, createProduct, updateProduct, deleteProduct } = useProduct();
    const { categories, fetchGlobalCategories } = useCategory();

    const fieldMapping: FieldMapping<SaveProductData> = {
        name: 'name',
        description: 'description',
        price: 'price',
        categoryId: 'categoryId'
    };

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

    // Create form hooks
    const {
        register: registerCreate,
        handleSubmit: handleCreateSubmit,
        formState: { errors: createErrors },
        reset: resetCreateForm,
        setError: setCreateError,
    } = useForm<SaveProductData>({
        resolver: yupResolver(productValidation),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            categoryId: ''
        }
    });

    // Edit form hooks
    const {
        register: registerEdit,
        handleSubmit: handleEditSubmit,
        formState: { errors: editErrors },
        reset: resetEditForm,
        setError: setEditError,
    } = useForm<SaveProductData>({
        resolver: yupResolver(productValidation),
    });

    useEffect(() => {
        if (user && user.id){
            fetchProductsByVendor(user.id);
        }
        fetchGlobalCategories();
    }, []);

    // Handler for creating product
    const handleCreateProduct = async (data: SaveProductData) => {
        try {
            if (!user?.id) {
                toast.error('You must be logged in as a vendor to create a product');
                return;
            }

            const productData: SaveProductData = {
                name: data.name,
                description: data.description,
                price: Number(data.price), // Ensure price is a number
                categoryId: data.categoryId,
                userId: user.id
            };

            await createProduct(productData);
            setIsCreateModalOpen(false);
            resetCreateForm();
            await fetchProductsByVendor(user.id);
        } catch (error: any) {
            console.error('Error creating product:', error); // Debug log

            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to create product. Please try again.');
            }

            // Handle specific field errors
            if (error.response?.data?.errors) {
                Object.entries(error.response.data.errors).forEach(([field, message]) => {
                    setCreateError(field as keyof SaveProductData, {
                        type: 'manual',
                        message: message as string
                    });
                });
            }
        }
    };

    // Handler for editing product
    const handleEditProduct = async (data: SaveProductData) => {
        if (!selectedProduct) return;

        try {
            if (!user?.id) {
                toast.error('You must be logged in as a vendor to create a product');
                return;
            }

            await updateProduct(selectedProduct.id, data);
            setSelectedProduct(null);
            setIsCreateModalOpen(false);
            resetCreateForm();
            await fetchProductsByVendor(user.id);
        } catch (error: any) {
            const wasHandled = handleServerErrors<SaveProductData>(
                error,
                setEditError,
                fieldMapping,
                {
                    toastMessage: 'Please check the form for errors',
                    logError: true
                }
            );

            if (!wasHandled) {
                toast.error('An unexpected error occurred');
                console.error('Error updating product:', error);
            }
        }
    };

    // Handler for deleting product
    const handleDeleteClick = (product: Product) => {
        if (!user?.id) {
            toast.error('You must be logged in as a vendor to create a product');
            return;
        }

        setConfirmDialog({
            isOpen: true,
            title: 'Delete Product',
            message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
            confirmText: 'Delete',
            confirmButtonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
            onConfirm: async () => {
                try {
                    await deleteProduct(product.id, user?.id);
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                    await fetchProductsByVendor(user.id);
                } catch (error) {
                    console.error('Error deleting product:', error);
                }
            }
        });
    };

    // Reset edit form when selected product changes
    useEffect(() => {
        if (selectedProduct) {
            resetEditForm({
                name: selectedProduct.name,
                description: selectedProduct.description,
                price: selectedProduct.price,
                categoryId: selectedProduct.category.id
            });
        }
    }, [selectedProduct, resetEditForm]);

    // Filter and pagination logic
    const filteredProducts = products.filter(product => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower)
        );
    });

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your products and listings
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Product
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
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

                {/* Product Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        <div className="text-sm text-gray-500">{product.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {product.category.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${product.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.reviews?.length || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex space-x-3 justify-end">
                                            <button
                                                onClick={() => setSelectedProduct(product)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(product)}
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

                    {/* Pagination */}
                    {filteredProducts.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredProducts.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={setCurrentPage}
                        />
                    )}

                    {/* Empty State */}
                    {filteredProducts.length === 0 && (
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
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm
                                    ? "No products match your search criteria."
                                    : "Get started by creating a new product."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Create Product Modal */}
                <Modal isOpen={isCreateModalOpen} onClose={() => {
                    setIsCreateModalOpen(false);
                    resetCreateForm();
                }}>
                    <div className="p-6">
                        <ModalHeader
                            title="Create New Product"
                            onClose={() => {
                                setIsCreateModalOpen(false);
                                resetCreateForm();
                            }}
                        />
                        <form onSubmit={handleCreateSubmit(handleCreateProduct)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    {...registerCreate("name")}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                    ${createErrors.name ? 'border-red-300' : ''}`}
                                />
                                {createErrors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {createErrors.name.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    {...registerCreate("description")}
                                    rows={4}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                    ${createErrors.description ? 'border-red-300' : ''}`}
                                />
                                {createErrors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {createErrors.description.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Price
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...registerCreate("price")}
                                        className={`block w-full pl-7 pr-12 sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500
                      ${createErrors.price ? 'border-red-300' : ''}`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {createErrors.price && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {createErrors.price.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    {...registerCreate("categoryId")}
                                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md
                    ${createErrors.categoryId ? 'border-red-300' : ''}`}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {createErrors.categoryId && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {createErrors.categoryId.message}
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
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Create Product
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>

                {/* Edit Product Modal */}
                <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
                    <div className="p-6">
                        <ModalHeader
                            title="Edit Product"
                            onClose={() => {
                                setSelectedProduct(null);
                                resetEditForm();
                            }}
                        />
                        {selectedProduct && (
                            <form onSubmit={handleEditSubmit(handleEditProduct)} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        {...registerEdit("name")}
                                        defaultValue={selectedProduct.name}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${editErrors.name ? 'border-red-300' : ''
                                            }`}
                                    />
                                    {editErrors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {editErrors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        {...registerEdit("description")}
                                        defaultValue={selectedProduct.description}
                                        rows={4}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${editErrors.description ? 'border-red-300' : ''
                                            }`}
                                    />
                                    {editErrors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {editErrors.description.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Price
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...registerEdit("price")}
                                            defaultValue={selectedProduct.price}
                                            className={`block w-full pl-7 pr-12 sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${editErrors.price ? 'border-red-300' : ''
                                                }`}
                                        />
                                    </div>
                                    {editErrors.price && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {editErrors.price.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category
                                    </label>
                                    <select
                                        {...registerEdit("categoryId")}
                                        defaultValue={selectedProduct.category.id}
                                        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${editErrors.categoryId ? 'border-red-300' : ''
                                            }`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {editErrors.categoryId && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {editErrors.categoryId.message}
                                        </p>
                                    )}
                                </div>

                                {/* Form Level Error */}
                                {editErrors.root?.serverError && (
                                    <div className="rounded-md bg-red-50 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">
                                                    {editErrors.root.serverError.message}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedProduct(null);
                                            resetEditForm();
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Update Product
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </Modal>

                {/* Delete Confirmation Modal */}
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
        </div>
    );
};

export default ProductPage;
