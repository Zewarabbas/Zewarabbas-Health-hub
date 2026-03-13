import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types';
import { Calendar, Clock, Facebook, Twitter, MessageCircle, Share2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BlogCard from '../components/BlogCard';
import AdPlaceholder from '../components/AdPlaceholder';

const SingleArticle = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const fetchedPost = await blogService.getPostBySlug(slug);
        setPost(fetchedPost);
        
        if (fetchedPost) {
          const allPosts = await blogService.getAllPosts();
          const related = allPosts
            .filter(p => p.category === fetchedPost.category && p.slug !== fetchedPost.slug)
            .slice(0, 2);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || 'Check out this article!';
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl mb-4">Article Not Found</h1>
        <Link to="/blog" className="text-primary font-bold">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <article className="lg:col-span-2">
          {/* Header */}
          <header className="mb-12">
            <Link
              to={`/blog?category=${CATEGORIES.find(c => c.name === post.category)?.slug}`}
              className="text-primary text-sm font-bold uppercase tracking-wider mb-4 block hover:underline"
            >
              {post.category}
            </Link>
            <h1 className="text-4xl md:text-6xl mb-8 leading-[1.1]">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
                  {post.author[0]}
                </div>
                <span className="font-medium text-slate-900">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="aspect-video rounded-3xl overflow-hidden mb-12">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <AdPlaceholder location="header" />

          {/* Content */}
          <div className="prose max-w-none mb-16" dangerouslySetInnerHTML={{ __html: post.content }}>
          </div>

          <AdPlaceholder location="in-article" />

          {/* Social Share */}
          <div className="flex items-center gap-4 py-8 border-y border-slate-100 mb-16">
            <span className="font-bold text-slate-900">Share this article:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleShare('facebook')}
                className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <Facebook size={18} />
              </button>
              <button 
                onClick={() => handleShare('twitter')}
                className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <Twitter size={18} />
              </button>
              <button 
                onClick={() => handleShare('whatsapp')}
                className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={18} />
              </button>
              <button 
                onClick={() => handleShare('copy')}
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mb-16">
              <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map(p => (
                  <BlogCard key={p.id} post={p} />
                ))}
              </div>
            </section>
          )}

          <AdPlaceholder location="footer" />
        </article>

        <Sidebar />
      </div>
    </div>
  );
};

export default SingleArticle;
