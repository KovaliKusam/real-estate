import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function CreateListing() {
  const currentUser = useSelector(state => state.user.currentUser);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 50,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  console.log(formData);
  console.log('Fixed Current user:', currentUser);

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id
      });
    } else if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      });
    } else if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleImageUpload = async (e) => {
    const filesArray = Array.from(e.target.files);
    setFiles(filesArray);
  
    const formData = new FormData();
    filesArray.forEach((file) => {
      formData.append('images', file); // 'images' is the key expected by backend
    });
  
    try {
      const res = await fetch('/api/listing/upload', {  // Update with the correct route for your backend
        method: 'POST',
        body: formData,
      });
  
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          imageUrls: data.urls,  // Assuming the backend returns an array of image URLs
        }));
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      setError('Error uploading images');
      console.error(error);
    }
  };   

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!currentUser || !currentUser._id) {
      console.error('User not logged in or invalid user data.');
      setError('User not logged in or invalid user data.');
      return;
    }
  
    const dataToSubmit = {
      ...formData,
      userRef: currentUser._id, // Attach user ID from currentUser
    };
  
    console.log('Submitting data:', dataToSubmit);
  
    try {
      setLoading(true);
      setError('');
  
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
  
      const data = await res.json();
      setLoading(false);
  
      if (!data.success) {
        setError(data.message);
        return;
      }
  
      console.log('Listing created successfully:', data);
    } catch (error) {
      console.error('Error submitting listing:', error);
      setError(error.message);
      setLoading(false);
    }
  };  

  const uploadImages = (files) => {
    // Placeholder for image upload logic
    return new Promise((resolve) => {
      // Simulate uploading the images and returning URLs
      setTimeout(() => {
        const uploadedUrls = files.map((file, index) => `/uploads/${file.name}`); // Example URL format
        resolve(uploadedUrls);
      }, 2000);
    });
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='discountPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Discounted price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={handleImageUpload}
              className='p-3 border border-gray-300 rounded w-full'
              type="file"
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              onClick={() => handleImageUpload({target: {files}})}
              className='p-3 border border-slate-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
              disabled={files.length === 0}
            >
              Upload
            </button>
          </div>
          <button
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}