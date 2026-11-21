const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// @desc    Upload an image (supports Base64 data URI or binary buffer)
// @route   POST /api/upload
// @access  Private (Admin only or authenticated)
const uploadImage = async (req, res, next) => {
  try {
    const { image, filename } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Please provide an image payload' });
    }

    // Check if it is a base64 data URL
    if (image.startsWith('data:image')) {
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ success: false, message: 'Invalid base64 image data' });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const extension = mimeType.split('/')[1] || 'png';
      const cleanExt = extension.replace('jpeg', 'jpg');

      const safeBaseName = (filename || 'upload').replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueName = `${safeBaseName}_${Date.now()}.${cleanExt}`;
      const filePath = path.join(uploadsDir, uniqueName);

      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

      const relativeUrl = `/uploads/${uniqueName}`;
      return res.status(200).json({
        success: true,
        url: relativeUrl,
        filename: uniqueName,
        message: 'Image uploaded and saved successfully',
      });
    }

    // If it's already an external URL
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return res.status(200).json({
        success: true,
        url: image,
        message: 'External image URL registered successfully',
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Unrecognized image format. Provide a valid base64 image data URL or web link.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
};

