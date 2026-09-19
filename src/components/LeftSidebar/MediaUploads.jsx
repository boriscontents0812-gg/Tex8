import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, User, Trash2 } from 'lucide-react';
import WakeSlider from '../ui/WakeSlider';

export default function MediaUploads({
  contactName = 'Laura 💖',
  contactPhotos = {},
  onContactPhotoChange,
  unreadBadge = 0,
  onUnreadBadgeChange,
  imageTags = [],
  scriptImages = {},
  onScriptImageChange,
  onLog = () => {}
}) {
  const contactFileRef = useRef(null);
  const scriptImageFileRefs = useRef({});

  // Upload handler
  const handleUpload = async (file, onDone) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      onLog(`Uploading ${file.name}...`);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        onDone(data.url);
        onLog(`Uploaded ${file.name} successfully!`);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    }
  };

  const currentAvatar = contactPhotos[contactName] || '/assets/avatar-laura.svg';

  return (
    <div className="anything-card p-4 mb-4 space-y-4">
      {/* 1. Contact Photos */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
          CONTACT PHOTOS
        </label>
        <div className="anything-card-inner p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center border border-neutral-200 shadow-xs">
              {currentAvatar ? (
                <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-neutral-400" />
              )}
            </div>
            <span className="text-xs font-semibold text-neutral-900 truncate max-w-[120px]">
              1. {contactName}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="file"
              ref={contactFileRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleUpload(e.target.files[0], (url) => {
                    onContactPhotoChange(contactName, url);
                  });
                }
              }}
            />
            <button
              onClick={() => contactFileRef.current?.click()}
              className="anything-pill-white px-3.5 py-1.5 text-[11px] font-semibold flex items-center gap-1.5"
            >
              <Upload className="w-3 h-3 text-sky-600" />
              <span>Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Unread Badge using WakeSlider */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
          <span>UNREAD BADGE</span>
          <span className="font-mono text-sky-600 text-xs font-semibold">{unreadBadge}</span>
        </div>
        <div className="anything-card-inner p-2.5">
          <WakeSlider
            value={unreadBadge}
            min={0}
            max={20}
            step={1}
            bars={20}
            height={32}
            restHeight={8}
            gap={2}
            fillColor="#0ea5e9"
            trackColor="#f1f5f9"
            crestColor="#38bdf8"
            showValue={false}
            onChange={(val) => onUnreadBadgeChange(val)}
          />
        </div>
      </div>

      {/* 3. Script Images */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
            SCRIPT IMAGES
          </label>
          <span className="text-[10px] text-neutral-400">Add [img: tag] in script</span>
        </div>

        {imageTags.length === 0 ? (
          <div className="anything-card-inner border-dashed p-3.5 text-center text-[11px] text-neutral-400">
            No image tags found. (e.g. 2: [img: fbi])
          </div>
        ) : (
          <div className="space-y-2">
            {imageTags.map((tag) => {
              const currentImg = scriptImages[tag] || (tag.toLowerCase() === 'fbi' ? '/assets/fbi.svg' : null);

              return (
                <div key={tag} className="anything-card-inner p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 overflow-hidden flex items-center justify-center border border-neutral-200 shadow-xs">
                      {currentImg ? (
                        <img src={currentImg} alt={tag} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-semibold text-emerald-700 block">
                        {tag}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {currentImg ? 'Image attached' : 'No image set'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="file"
                      ref={(el) => (scriptImageFileRefs.current[tag] = el)}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleUpload(e.target.files[0], (url) => {
                            onScriptImageChange(tag, url);
                          });
                        }
                      }}
                    />
                    <button
                      onClick={() => scriptImageFileRefs.current[tag]?.click()}
                      className="anything-pill-white px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3 text-sky-600" />
                      <span>{currentImg ? 'Change' : 'Upload'}</span>
                    </button>
                    {currentImg && (
                      <button
                        onClick={() => onScriptImageChange(tag, null)}
                        className="p-1.5 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
