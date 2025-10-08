import { faArrowUp, faImages, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfileUpdate } from '../context/UserSlice';
import NavLogoBar from '../navbar/NavLogoBar';
import Navbar from '../navbar/Navbar';
import { api } from '../protact-route/api';

const UploadPost = () => {
  const { profilePic, fullName } = useSelector((state) => state.user);
  const [uploadImage, setUploadImage] = useState(null);
  const [postDescription, setPostDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const uploadPost = async () => {
    if (!uploadImage && !postDescription.trim()) return;
    try {
      setLoading(true);
      const formData = new FormData();
      if (uploadImage) formData.append('post', uploadImage);
      formData.append('postDescription', postDescription);

      const response = await api.post('post/postUpload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        setPostDescription('');
        setUploadImage(null);
        dispatch(setUserProfileUpdate({ profileUpdate: Date.now() }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Mobile Top Bar */}
      <div className="d-md-none mb-3">
        <NavLogoBar />
      </div>

      <div  className='height-arggest' style={{display: "flex", flexDirection: "column", }}>
        {/* Desktop Navbar */}
        <div className="d-none d-md-block" style={{ flex: 2 }}>
          <Navbar />
        </div>

        {/* Upload Section */}
        <div style={{ flex: 10, margin: '1rem' }}>
          <div
            className="card shadow-sm p-3"
            style={{
              backgroundColor: '#1c1c1c',
              border: '1px solid #333',
              borderRadius: '12px',
              color: 'white',
              maxWidth: '600px',
              margin: 'auto',
            }}
          >
            {/* Card Header */}
            <div className="d-flex align-items-center mb-3">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="profile"
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '10px',
                  }}
                />
              ) : (
                <span
                  style={{
                    backgroundColor: '#ff4d4d',
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    marginRight: '10px',
                    textTransform: 'uppercase',
                  }}
                >
                  {fullName ? fullName[0] : '?'}
                </span>
              )}
              <h6 className="mb-0 fw-bold">{fullName || 'Guest User'}</h6>
            </div>

            {/* Image Preview */}
            {uploadImage && (
              <div className="position-relative mb-3 text-center">
                <img
                  src={URL.createObjectURL(uploadImage)}
                  alt="preview"
                  style={{
                    width: '100%',
                    maxHeight:'280px',
                    objectFit: 'contain',
                    borderRadius: '10px',
                  }}
                />
                <button
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
                  onClick={() => setUploadImage(null)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}

            {/* Post Description */}
            <textarea
              className="form-control mb-3"
              rows="3"
              placeholder="What's on your mind?"
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              style={{
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                color: 'white',
                borderRadius: '8px',
                resize: 'none',
              }}
            />

            {/* Actions */}
            <div className="d-flex justify-content-between align-items-center">
              {/* Upload Button */}
              <div>
                <label htmlFor="upload" className="btn btn-outline-warning me-2">
                  <FontAwesomeIcon icon={faImages} /> Add Photo
                </label>
                <input
                  onChange={(e) => setUploadImage(e.target.files[0])}
                  style={{ display: 'none' }}
                  id="upload"
                  type="file"
                  accept="image/*"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={uploadPost}
                disabled={loading || (!uploadImage && !postDescription.trim())}
                className="btn btn-warning fw-semibold px-4"
              >
                {loading ? 'Posting...' : (
                  <>
                    Post <FontAwesomeIcon icon={faArrowUp} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
           <div className="d-block d-md-none" >
          <Navbar />
        </div>
      </div>
    </div>
  );
};

export default UploadPost;
