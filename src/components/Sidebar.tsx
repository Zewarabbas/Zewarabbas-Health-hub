import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types';
import BlogCard from './BlogCard';

const Sidebar = () => {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const unsubscribe = blogService.subscribeToPosts((posts) => {
      setRecentPosts(posts.slice(0, 4));
    });
    return () => unsubscribe();
  }, []);

  return (
    <aside className="space-y-12">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          Categories
        </h3>
        <ul className="space-y-2">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                to={`/blog?category=${cat.slug}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-accent group transition-colors"
              >
                <span className="text-sm font-medium text-slate-600 group-hover:text-primary">
                  {cat.name}
                </span>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      <div>
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          Recent Posts
        </h3>
        <div className="space-y-6">
          {recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} horizontal />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
