import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Reusable Image Upload component for Supabase Storage.
 */
const ImageUpload = ({ bucket, path, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
       return toast.error('Please upload an image file (JPG, PNG)');
    }
    if (file.size > 2 * 1024 * 1024) {
       return toast.error('File size must be less than 2MB');
    }

    setPreview(URL.createObjectURL(file));
  };

  const uploadFile = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(10); // Start progress

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${path}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: true,
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      toast.success('Image uploaded successfully!');
      onUploadComplete(publicUrl);
      setPreview(null);
      setProgress(0);
      
    } catch (error) {
      console.error('Upload Error:', error.message);
      toast.error('Upload failed, try again');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div 
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-gray-200 rounded-[2rem] p-10 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-all group"
        >
          <div className="bg-slate-100 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
            <Upload className="text-slate-400 group-hover:text-indigo-600" size={32} />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Upload Item Image</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
        </div>
      ) : (
        <div className="relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-premium aspect-square bg-slate-50">
           <img src={preview} alt="Preview" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex space-x-4">
                 <button 
                  onClick={() => setPreview(null)}
                  className="bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white hover:bg-red-500 transition-all"
                 >
                    <X size={24} />
                 </button>
                 {!uploading && (
                   <button 
                    onClick={uploadFile}
                    className="bg-indigo-600 p-3 rounded-2xl text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40"
                   >
                     <Upload size={24} />
                   </button>
                 )}
              </div>
           </div>
           
           {uploading && (
             <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-200">
               <div 
                className="h-full bg-indigo-600 transition-all duration-300" 
                style={{ width: `${progress}%` }}
               />
             </div>
           )}
           
           {uploading && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
