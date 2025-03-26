import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ProductFormData } from '../../types/dashboardTypes';

interface AddProductFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ProductFormData & { image?: File }) => Promise<void>;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<ProductFormData>({
        title: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        brand: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                image: imageFile || undefined
            });
            onClose();
            // Reset form after successful submission
            setFormData({
                title: '',
                description: '',
                price: 0,
                stock: 0,
                category: '',
                brand: ''
            });
            setImageFile(null);
            setImagePreview(null);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl min-w-[600px]">
                <div className="p-8">
                    <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-6">Add New Product</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Title*
                                    </label>
                                    <Input
                                        type="text"
                                        name="title"
                                        id="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description*
                                    </label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        rows={4}
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-input shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 min-h-[120px]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                            Price*
                                        </label>
                                        <Input
                                            type="number"
                                            name="price"
                                            id="price"
                                            min="0"
                                            step="0.01"
                                            required
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                            Stock*
                                        </label>
                                        <Input
                                            type="number"
                                            name="stock"
                                            id="stock"
                                            min="0"
                                            required
                                            value={formData.stock}
                                            onChange={handleChange}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Image
                                    </label>
                                    <div className="mt-1 flex flex-col items-center">
                                        {imagePreview ? (
                                            <>
                                                <div className="relative w-full h-48 rounded-md overflow-hidden border border-gray-300 mb-2">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setImageFile(null);
                                                        setImagePreview(null);
                                                    }}
                                                >
                                                    Remove Image
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
                                                <div className="flex items-center justify-center text-gray-400 mb-2">
                                                    <svg
                                                        className="h-12 w-12"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                                    >
                                                        <span>Upload an image</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            className="sr-only"
                                                            onChange={handleImageChange}
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category*
                                    </label>
                                    <Input
                                        type="text"
                                        name="category"
                                        id="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                                        Brand (Optional)
                                    </label>
                                    <Input
                                        type="text"
                                        name="brand"
                                        id="brand"
                                        value={formData.brand || ''}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                                className="px-6"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="px-6"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Add Product
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductForm;