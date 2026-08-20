import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { KnowledgeBaseArticle, KBCategory } from '../../../types';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  Sparkles 
} from 'lucide-react';

export const KnowledgeBaseTab: React.FC = () => {
  const { activeClinic, activeClinicId, authFetch, refreshClinicData } = useAdminAuth();
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingArticle, setEditingArticle] = useState<KnowledgeBaseArticle | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (activeClinic?.kbArticles) {
      setArticles(activeClinic.kbArticles);
    }
  }, [activeClinic]);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All Knowledge' },
    { key: 'faqs', label: 'General FAQs' },
    { key: 'insurance', label: 'Insurance & Claims' },
    { key: 'financing', label: 'Financing & Payment' },
    { key: 'parking_location', label: 'Parking & Directions' },
    { key: 'doctor_credentials', label: 'Doctor Credentials' },
    { key: 'cancellation_refund', label: 'Policies & Cancellations' },
    { key: 'treatment_info', label: 'Treatment Specifics' },
    { key: 'custom', label: 'Custom Articles' }
  ];

  const handleOpenAdd = () => {
    setEditingArticle({
      id: '',
      clinicId: activeClinicId,
      category: 'faqs',
      title: '',
      content: '',
      tags: ['faq', 'policy'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title || !editingArticle.content) return;

    setIsSaving(true);
    try {
      const isEdit = !!editingArticle.id;
      const url = isEdit ? `/api/admin/kb/${editingArticle.id}` : '/api/admin/kb';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify({
          clinicId: activeClinicId,
          article: editingArticle
        })
      });

      if (res.ok) {
        setToastMsg({ type: 'success', text: `Article "${editingArticle.title}" saved! Synchronized into AI knowledge base.` });
        setEditingArticle(null);
        await refreshClinicData();
      } else {
        const err = await res.json();
        setToastMsg({ type: 'error', text: err.error || 'Failed to save article' });
      }
    } catch (err: any) {
      setToastMsg({ type: 'error', text: err.message || 'Error occurred' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!window.confirm(`Delete article "${title}" from the knowledge base?`)) return;

    try {
      const res = await authFetch(`/api/admin/kb/${id}?clinicId=${activeClinicId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setToastMsg({ type: 'success', text: 'Article deleted.' });
        await refreshClinicData();
      }
    } catch (err: any) {
      setToastMsg({ type: 'error', text: err.message || 'Error' });
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchesCat = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif">Knowledge Base & FAQ Engine</h1>
          <p className="text-sm text-slate-400">
            Articles and clinic facts used by the AI Coordinator to answer patient inquiries authoritatively.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Knowledge Article</span>
        </button>
      </div>

      {toastMsg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
          toastMsg.type === 'success' ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200' : 'bg-rose-950/80 border border-rose-800 text-rose-200'
        }`}>
          {toastMsg.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" /> : <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Search & Categories Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search FAQs, insurance rules, parking, policies..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-cyan-950 border border-cyan-800 text-cyan-400 font-semibold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            No knowledge articles match your filter. Click "+ Add Knowledge Article" to create one.
          </div>
        ) : (
          filteredArticles.map(article => (
            <div key={article.id} className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-md flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-cyan-400 border border-slate-700">
                    {article.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingArticle({ ...article })}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(article.id, article.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mt-2.5 font-serif">{article.title}</h3>
                <p className="text-xs text-slate-300 mt-2 line-clamp-4 leading-relaxed">
                  {article.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                {article.tags?.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-950 text-slate-400 rounded-md text-[10px] border border-slate-800">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-serif">
                {editingArticle.id ? 'Edit Knowledge Article' : 'New Knowledge Base Article'}
              </h3>
              <button onClick={() => setEditingArticle(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Article Title / Frequently Asked Question
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What parking validation do you provide?"
                  value={editingArticle.title}
                  onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={editingArticle.category}
                  onChange={e => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="faqs">General FAQs</option>
                  <option value="insurance">Insurance & Benefits</option>
                  <option value="financing">Financing & Payment Plans</option>
                  <option value="parking_location">Parking, Transit & Directions</option>
                  <option value="doctor_credentials">Doctor Credentials & Bio</option>
                  <option value="cancellation_refund">Cancellation & Refund Policy</option>
                  <option value="treatment_info">Treatment Specific Details</option>
                  <option value="custom">Custom Policy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Verified Answer / Policy Content (AI Response Grounding)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Exact information the AI should provide when asked about this topic..."
                  value={editingArticle.content}
                  onChange={e => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Search Tags / Keywords (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. parking, garage, 450 sutter, bart"
                  value={editingArticle.tags?.join(', ') || ''}
                  onChange={e => setEditingArticle({
                    ...editingArticle,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Knowledge Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
