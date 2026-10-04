import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../../config';
import { Star, RefreshCcw, Save, Trash2, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TestimonialSettings({ isDark }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    city: '',
    artStyle: '',
    text: '',
    rating: 5,
    isFeatured: true
  });
  const [imageFile, setImageFile] = useState(null);
  const fileRef = useRef(null);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/testimonials`);
      if (res.ok) {
        setTestimonials(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('city', form.city);
    formData.append('artStyle', form.artStyle);
    formData.append('text', form.text);
    formData.append('rating', form.rating);
    formData.append('isFeatured', form.isFeatured);
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await fetch(`${API_BASE_URL}/api/testimonials`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        toast.success('Testimonial uploaded successfully');
        setForm({ name: '', city: '', artStyle: '', text: '', rating: 5, isFeatured: true });
        setImageFile(null);
        if (fileRef.current) fileRef.current.value = '';
        fetchTestimonials();
      } else {
        toast.error('Failed to upload testimonial');
      }
    } catch (err) {
      toast.error('Error uploading testimonial');
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium">Delete this testimonial forever?</p>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const token = localStorage.getItem('adminToken');
              try {
                const res = await fetch(`${API_BASE_URL}/api/testimonials/${id}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                  toast.success("Deleted successfully");
                  fetchTestimonials();
                } else {
                  toast.error("Failed to delete");
                }
              } catch (err) {
                toast.error("Error deleting");
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-red-600 transition-colors"
          >
            Confirm
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-neutral-200 text-black rounded text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const toggleFeatured = async (id) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/api/testimonials/${id}/toggle-feature`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-6">
      <div className="space-y-1">
        <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Manage Testimonials</h3>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Upload customer reviews and feature them on the homepage.</p>
      </div>

      <div className={`p-4 sm:p-6 rounded-2xl border ${isDark ? "bg-white/[0.02] border-white/5" : "bg-gray-50 border-black/5"}`}>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>Customer Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={`w-full py-2 px-3 rounded-lg text-[13px] outline-none border transition-all ${isDark ? "bg-black/40 border-white/10 text-white focus:border-white/30" : "bg-white border-black/10 text-black focus:border-black/30"}`} placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-1">
              <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>City *</label>
              <input type="text" required value={form.city} onChange={e => setForm({...form, city: e.target.value})} className={`w-full py-2 px-3 rounded-lg text-[13px] outline-none border transition-all ${isDark ? "bg-black/40 border-white/10 text-white focus:border-white/30" : "bg-white border-black/10 text-black focus:border-black/30"}`} placeholder="e.g. Mumbai" />
            </div>
            <div className="space-y-1">
              <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>Art Style *</label>
              <input type="text" required value={form.artStyle} onChange={e => setForm({...form, artStyle: e.target.value})} className={`w-full py-2 px-3 rounded-lg text-[13px] outline-none border transition-all ${isDark ? "bg-black/40 border-white/10 text-white focus:border-white/30" : "bg-white border-black/10 text-black focus:border-black/30"}`} placeholder="e.g. Charcoal Drawing" />
            </div>
            <div className="space-y-1">
              <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>Rating (1-5) *</label>
              <input type="number" min="1" max="5" required value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} className={`w-full py-2 px-3 rounded-lg text-[13px] outline-none border transition-all ${isDark ? "bg-black/40 border-white/10 text-white focus:border-white/30" : "bg-white border-black/10 text-black focus:border-black/30"}`} />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>Review Text *</label>
            <textarea required value={form.text} onChange={e => setForm({...form, text: e.target.value})} rows="3" className={`w-full py-2 px-3 rounded-lg text-[13px] outline-none border transition-all resize-none ${isDark ? "bg-black/40 border-white/10 text-white focus:border-white/30" : "bg-white border-black/10 text-black focus:border-black/30"}`} placeholder="The actual testimonial..."></textarea>
          </div>

          <div className="space-y-1">
            <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>Customer Avatar (Optional)</label>
            <input type="file" accept="image/*" ref={fileRef} onChange={e => setImageFile(e.target.files[0])} className={`w-full text-[12px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[11px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
            {imageFile && (
              <div className="mt-4 relative rounded-full overflow-hidden border border-black/10 dark:border-white/10 w-24 h-24 group">
                <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setImageFile(null); if(fileRef.current) fileRef.current.value=''; }} className="absolute inset-0 m-auto w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={loading} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] uppercase font-bold transition-all shadow-md ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-neutral-800"}`}>
              {loading ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
              {loading ? 'Saving...' : 'Add Testimonial'}
            </button>
          </div>
        </form>

        <div className="space-y-4 pt-8">
          <h4 className={`text-[14px] font-semibold ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Live Testimonials ({testimonials.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map(t => (
              <div key={t._id} className={`relative p-4 rounded-xl border transition-all ${isDark ? "bg-black/30 border-white/10 text-white" : "bg-white border-black/10 text-black"}`}>
                <div className="flex items-start gap-3">
                  {t.imageUrl ? (
                    <img src={t.imageUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${isDark ? "bg-white/10 text-white" : "bg-black/10 text-black"}`}>
                      <span className="font-bold text-[14px]">{t.name?.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-[13px] truncate">{t.name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} fill={i < t.rating ? '#facc15' : 'transparent'} color={i < t.rating ? '#facc15' : 'currentColor'} className="opacity-50" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] opacity-60 truncate">{t.city} • {t.artStyle}</p>
                    <p className="text-[12px] opacity-80 mt-2 line-clamp-3">{t.text}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-black/5 dark:border-white/5">
                  <button onClick={() => toggleFeatured(t._id)} className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md transition-colors ${t.isFeatured ? "bg-emerald-500/10 text-emerald-500" : (isDark ? "bg-white/5 text-gray-400" : "bg-black/5 text-gray-500")}`}>
                    <CheckCircle size={12} />
                    {t.isFeatured ? 'Featured' : 'Hidden'}
                  </button>
                  <button onClick={() => handleDelete(t._id)} className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md transition-colors bg-red-500/10 text-red-500 ml-auto hover:bg-red-500/20">
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
