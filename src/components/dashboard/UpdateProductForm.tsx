import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, X, Image as ImageIcon } from 'lucide-react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { toast } from 'sonner';
import { Product } from '../../types/dashboardTypes';

interface UpdateProductFormProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmit: (productId: string, formData: FormData) => Promise<void>;
}

const UpdateProductForm: React.FC<UpdateProductFormProps> = ({ 
  open, 
  onClose, 
  product,
  onSubmit 
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    tags: [] as string[],
    published: true,
    stock: 0
  });

  const [files, setFiles] = useState<{
    thumbnail?: File;
    images: File[];
    existingThumbnail?: string;
    existingImages: string[];
  }>({ 
    images: [],
    existingImages: []
  });

  const [tagInput, setTagInput] = useState('');

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || 0,
        category: product.category || '',
        tags: product.tags || [],
        published: product.published !== false, // default to true if undefined
        stock: product.stock || 0
      });

      setFiles(prev => ({
        ...prev,
        existingThumbnail: product.thumbnail,
        existingImages: product.images || []
      }));
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const newThumbnail = files.thumbnail || newFiles[0];
    const remainingImages = newFiles.slice(files.thumbnail ? 0 : 1);

    setFiles(prev => ({
      ...prev,
      thumbnail: newThumbnail,
      images: [...prev.images, ...remainingImages]
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number, isThumbnail: boolean = false) => {
    if (isThumbnail) {
      setFiles(prev => ({ 
        ...prev, 
        thumbnail: undefined,
        existingThumbnail: undefined 
      }));
    } else {
      setFiles(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const removeExistingImage = (index: number, isThumbnail: boolean = false) => {
    if (isThumbnail) {
      setFiles(prev => ({ 
        ...prev, 
        existingThumbnail: undefined 
      }));
    } else {
      setFiles(prev => ({
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index)
      }));
    }
  };

  const setAsThumbnail = (file: File | string) => {
    if (typeof file === 'string') {
      // Existing image
      setFiles(prev => ({
        existingThumbnail: file,
        existingImages: prev.existingImages.filter(f => f !== file)
                          .concat(prev.existingThumbnail ? [prev.existingThumbnail] : []),
        thumbnail: prev.thumbnail,
        images: prev.images
      }));
    } else {
      // New file
      setFiles(prev => ({
        thumbnail: file,
        images: prev.images.filter(f => f !== file).concat(prev.thumbnail ? [prev.thumbnail] : []),
        existingThumbnail: prev.existingThumbnail,
        existingImages: prev.existingImages
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const updateProductMutation = useMutation({
    mutationFn: async (formDataToSend: FormData) => {
      if (!product) throw new Error('No product selected');
      await onSubmit(product._id, formDataToSend);
    },
    onMutate: async (formDataToSend) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['products'] });
      
      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<Product[]>(['products']);
  
      // Optimistically update the product in cache
      queryClient.setQueryData(['products'], (old: Product[] | undefined) => {
        if (!old) return [];
        
        return old.map(p => {
          if (p._id === product!._id) {
            // Create optimistic update with form values
            return {
              ...p,
              title: formDataToSend.get('title') as string || p.title,
              description: formDataToSend.get('description') as string || p.description,
              price: Number(formDataToSend.get('price')) || p.price,
              category: formDataToSend.get('category') as string || p.category,
              published: formDataToSend.get('published') === 'true',
              stock: Number(formDataToSend.get('stock')) || p.stock,
              tags: formDataToSend.getAll('tags[]') as string[] || p.tags,
              // For files, we can't preview them, so we keep the existing ones optimistically
              thumbnail: files.thumbnail ? 'optimistic-thumbnail.jpg' : p.thumbnail,
              images: [
                ...(files.images.length > 0 ? ['optimistic-image.jpg'] : []),
                ...(files.existingImages || [])
              ]
            };
          }
          return p;
        });
      });
  
      return { previousProducts };
    },
    onSuccess: () => {
      toast.success('Product updated successfully!');
      onClose();
      resetForm();
    },
    onError: (error: Error, _, context) => {
      // Rollback to the previous value
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      toast.error(error.message || 'Failed to update product');
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
  
    // Append product data
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price.toString());
    formDataToSend.append('category', formData.category);
    formDataToSend.append('published', formData.published.toString());
    formDataToSend.append('stock', formData.stock.toString());
    formData.tags.forEach(tag => {
      formDataToSend.append('tags[]', tag);
    });
  
    // Append files
    if (files.thumbnail) {
      formDataToSend.append('thumbnail', files.thumbnail);
    }
    files.images.forEach(image => {
      formDataToSend.append('images', image);
    });
  
    // Append existing images to keep
    if (files.existingThumbnail) {
      formDataToSend.append('existingThumbnail', files.existingThumbnail);
    }
    files.existingImages.forEach(image => {
      formDataToSend.append('existingImages[]', image);
    });
  
    updateProductMutation.mutate(formDataToSend);
  };
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      category: '',
      tags: [],
      published: true,
      stock: 0
    });
    setFiles({ images: [], existingImages: [] });
    setTagInput('');
  };


  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Update Product</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title
                </label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
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
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Input
                  type="text"
                  name="category"
                  id="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <Input
                  type="number"
                  name="stock"
                  id="stock"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                required
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-md border border-input shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images
              </label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Images
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <span className="text-sm text-gray-500">
                    {files.thumbnail || files.existingThumbnail || files.images.length > 0 || files.existingImages.length > 0
                      ? `${(files.thumbnail || files.existingThumbnail) ? 1 : 0} thumbnail, ${files.images.length + files.existingImages.length} images`
                      : 'No images selected'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {/* Existing thumbnail */}
                  {files.existingThumbnail && (
                    <div className="relative group border rounded-md overflow-hidden">
                      <img
                        src={files.existingThumbnail}
                        alt="Thumbnail preview"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                          Thumbnail
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => removeExistingImage(0, true)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* New thumbnail */}
                  {files.thumbnail && (
                    <div className="relative group border rounded-md overflow-hidden">
                      <img
                        src={URL.createObjectURL(files.thumbnail)}
                        alt="Thumbnail preview"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                          New Thumbnail
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => removeFile(0, true)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Existing images */}
                  {files.existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative group border rounded-md overflow-hidden">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => setAsThumbnail(image)}
                          title="Set as thumbnail"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => removeExistingImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* New images */}
                  {files.images.map((file, index) => (
                    <div key={`new-${index}`} className="relative group border rounded-md overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New product image ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => setAsThumbnail(file)}
                          title="Set as thumbnail"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tag and press Enter"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updateProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProductMutation.isPending}
              >
                {updateProductMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Update Product
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductForm;