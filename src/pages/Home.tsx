import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Play, Star, Users, Award } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types';
import BlogCard from '../components/BlogCard';
import AdPlaceholder from '../components/AdPlaceholder';
import * as Icons from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = blogService.subscribeToPosts((fetchedPosts) => {
      setPosts(fetchedPosts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const featuredPosts = posts.filter(p => p.featured).slice(0, 3);
  const popularPosts = posts.slice(0, 3);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1920"
            alt="Fitness Hero"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Star size={14} />
              Your Journey to Better Health Starts Here
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-6"
            >
              Transform Your <span className="text-primary italic">Life</span> Through Fitness
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 mb-10 leading-relaxed"
            >
              Expert advice, workout plans, and nutrition tips designed to help you reach your peak performance and live a healthier, happier life.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/blog"
                className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center gap-2 group"
              >
                Explore Articles
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all border border-slate-200 flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-primary">
                  <Play size={14} fill="currentColor" />
                </div>
                Watch Success Stories
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex items-center gap-8"
            >
              <div className="flex items-center gap-2">
                <Users className="text-primary" size={20} />
                <span className="text-sm font-medium text-slate-500">50k+ Active Members</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="text-primary" size={20} />
                <span className="text-sm font-medium text-slate-500">Certified Experts</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdPlaceholder location="header" />
      </div>

      {/* Featured Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl mb-4 font-bold text-slate-900">Featured Articles</h2>
            <p className="text-slate-500">Handpicked stories and guides for your wellness journey.</p>
          </div>
          <Link to="/blog" className="text-primary font-bold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
            {featuredPosts.length === 0 && posts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="bg-accent py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 font-bold text-slate-900">Explore by Category</h2>
            <p className="text-slate-500">Find exactly what you need to improve your fitness routine.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => {
              const IconComponent = (Icons as any)[cat.icon];
              return (
                <Link
                  key={cat.slug}
                  to={`/blog?category=${cat.slug}`}
                  className="bg-white p-8 rounded-2xl text-center hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Articles & Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl mb-8 font-bold text-slate-900">Popular Articles</h2>
            <div className="space-y-8">
              {popularPosts.map((post) => (
                <div key={post.id} className="group flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-64 aspect-video rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2 block">
                      {post.category}
                    </span>
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            {/* Newsletter Box */}
            <div className="bg-slate-900 text-white p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <h3 className="text-2xl font-display font-bold mb-4 relative z-10">Join Our Community</h3>
              <p className="text-slate-400 text-sm mb-8 relative z-10">
                Get weekly fitness plans and healthy recipes delivered straight to your inbox.
              </p>
              <form className="space-y-4 relative z-10">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary"
                />
                <button className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                  Subscribe Now
                </button>
              </form>
              <p className="text-[10px] text-slate-500 mt-4 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>

            <AdPlaceholder location="sidebar" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
