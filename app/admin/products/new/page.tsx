'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload, X } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    colors: [] as string[],
    sizes: [] as string[],
    collaborateur: '',
    images: [] as File[],
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Validate file size (max 5MB each)
    const validFiles = acceptedFiles.filter(file => file.size <= 5 * 1024 * 1024);
    if (validFiles.length !== acceptedFiles.length) {
      setError('Some files were too large (max 5MB each)');
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));

    // Create preview URLs for the images
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    setError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.images.length === 0) {
        throw new Error('Please add at least one image');
      }

      // First upload images
      const imageFormData = new FormData();
      formData.images.forEach((image) => {
        imageFormData.append('images', image);
      });

      console.log('Uploading images...');
      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        body: imageFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload images');
      }

      const { images: uploadedImages } = await uploadResponse.json();
      console.log('Uploaded images:', uploadedImages);

      // Then create product with image URLs
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        colors: formData.colors,
        sizes: formData.sizes,
        collaborateur: formData.collaborateur || undefined,
        images: uploadedImages // Now this is an array of URL strings
      };

      console.log('Creating product with data:', productData);
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error instanceof Error ? error.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'colors' | 'sizes'
  ) => {
    const values = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      [field]: values,
    }));
  };

  const categories = [
    'Dresses',
    'Suits',
    'Outerwear',
    'Accessorie'
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-gray-600">Create a new product with images and details</p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Product Images</h2>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? 'Drop the images here...'
                : 'Drag & drop images here, or click to select files'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports: JPG, PNG, WebP (max 5MB each)
            </p>
          </div>

          {previewImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {previewImages.map((preview, index) => (
                <div key={preview} className="relative group">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm
                      opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
          <h2 className="text-lg font-semibold mb-4">Product Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price (TND) *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">TND</span>
                </div>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="block w-full pl-12 rounded-md border-gray-300 shadow-sm 
                    focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Collaborateur
              </label>
              <input
                type="text"
                name="collaborateur"
                value={formData.collaborateur}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter collaborateur name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Colors
              </label>
              <input
                type="text"
                value={formData.colors.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'colors')}
                placeholder="red, blue, green"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">Separate colors with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sizes
              </label>
              <input
                type="text"
                value={formData.sizes.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'sizes')}
                placeholder="S, M, L, XL"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">Separate sizes with commas</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 
              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium 
              text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
              inline-flex items-center"
          >
            {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
