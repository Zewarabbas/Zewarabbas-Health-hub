import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
  horizontal?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, horizontal = false }) => {
  if (horizontal) {
    return (
      <Link to={`/blog/${post.slug}`} className="group flex gap-4 items-start">
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {post.title}
          </h4>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            {post.date}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
      <Link to={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {post.category}
          </span>
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{post.author}</span>
          </div>
        </div>
        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-slate-500 text-sm line-clamp-3 mb-6">
          {post.excerpt}
        </p>
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-primary font-bold text-sm group/btn"
        >
          Read More
          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
