import React from 'react'
import "../Css/PhotoPreview.css"

const PhotoPreview = ({ image }) => {
  // console.log(image);
  const imageSrc = image instanceof File ? URL.createObjectURL(image) : image;
  // console.log(imageSrc);
  return (
    <div className="photo-preview">
      {image && (
        <img
          src={imageSrc}
          alt="Student Photo"
          className="preview-image"
        />
      )}
    </div>
  )
}

export default PhotoPreview