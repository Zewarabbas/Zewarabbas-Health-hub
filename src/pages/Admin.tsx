import React, { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logout, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { blogService } from '../services/blogService';
import { BlogPost, Category } from '../types';
import { CATEGORIES } from '../constants';
import { Plus, Edit2, Trash2, LogOut, Save, X, Search } from 'lucide-react';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const ADMIN_EMAIL = "fast8585100@gmail.com";

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user || user.email !== ADMIN_EMAIL) {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    let unsubscribePosts: (() => void) | undefined;

    if (user && user.email === ADMIN_EMAIL) {
      unsubscribePosts = blogService.subscribeToPosts((fetchedPosts) => {
        setPosts(fetchedPosts);
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribePosts) unsubscribePosts();
    };
  }, [user]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  };

  const handleCreate = () => {
    setCurrentPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: CATEGORIES[0].name,
      author: user?.displayName || 'Admin',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      image: 'https://picsum.photos/seed/fitness/800/600',
      readTime: '5 min read',
      featured: false
    });
    setIsEditing(true);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await blogService.deletePost(id);
      } catch (error) {
        alert("Delete failed.");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost) return;

    try {
      if (currentPost.id) {
        await blogService.updatePost(currentPost.id, currentPost);
      } else {
        await blogService.createPost(currentPost as Omit<BlogPost, 'id'>);
      }
      setIsEditing(false);
      setCurrentPost(null);
    } catch (error) {
      alert("Save failed. Check console for details.");
      console.error(error);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-8">Admin Access Required</h1>
        <button 
          onClick={handleLogin}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          Login with Google
        </button>
        {user && user.email !== ADMIN_EMAIL && (
          <p className="mt-4 text-red-500">Access denied for {user.email}. Please use the admin account.</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Manage your blog articles and content.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleCreate}
            className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Post
          </button>
          <button 
            onClick={logout}
            className="text-slate-500 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">{currentPost?.id ? 'Edit Post' : 'Create New Post'}</h2>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Title</label>
                <input 
                  type="text" 
                  required
                  value={currentPost?.title}
                  onChange={e => setCurrentPost({...currentPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Slug (URL)</label>
                <input 
                  type="text" 
                  required
                  value={currentPost?.slug}
                  onChange={e => setCurrentPost({...currentPost, slug: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Category</label>
                <select 
                  value={currentPost?.category}
                  onChange={e => setCurrentPost({...currentPost, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.slug} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Image URL</label>
                <input 
                  type="text" 
                  required
                  value={currentPost?.image}
                  onChange={e => setCurrentPost({...currentPost, image: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Read Time</label>
                <input 
                  type="text" 
                  value={currentPost?.readTime}
                  onChange={e => setCurrentPost({...currentPost, readTime: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Excerpt (Short Description)</label>
              <textarea 
                rows={2}
                value={currentPost?.excerpt}
                onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Content (HTML Supported)</label>
              <textarea 
                rows={10}
                required
                value={currentPost?.content}
                onChange={e => setCurrentPost({...currentPost, content: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button 
                type="submit"
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Save size={20} />
                Save Post
              </button>
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search posts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">Post</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">Category</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">Date</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPosts.map(post => (
                    <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={post.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{post.title}</div>
                            <div className="text-xs text-slate-500">{post.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-accent text-primary text-xs font-bold rounded-full">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {post.date}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(post)}
                            className="p-2 text-slate-400 hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(post.id!)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPosts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        No posts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
