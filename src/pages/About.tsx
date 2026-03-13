import React from 'react';
import { Target, Heart, ShieldCheck, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1920"
            alt="About Hero"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl mb-6">Our Mission</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Empowering individuals to take control of their health through science-backed education and community support.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-4xl mb-6">Who We Are</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Healthy Life Hub was founded in 2024 with a simple goal: to cut through the noise of the fitness industry and provide clear, actionable, and science-based health advice.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Our team consists of certified personal trainers, nutritionists, and wellness experts who are passionate about helping you achieve your goals, whether that's losing weight, building muscle, or simply feeling better in your own skin.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-3xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400" alt="Team" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="aspect-square rounded-3xl overflow-hidden mt-8">
              <img src="https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=400" alt="Team" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              icon: Target, 
              title: 'Precision', 
              desc: 'We provide accurate, evidence-based health and fitness information to help people make better lifestyle decisions.' 
            },
            { 
              icon: Heart, 
              title: 'Compassion', 
              desc: 'We understand that every health and fitness journey is different, and we support everyone with encouragement and care.' 
            },
            { 
              icon: ShieldCheck, 
              title: 'Integrity', 
              desc: 'Your health, safety and trust are our top priorities, and we always share honest and reliable information.' 
            },
            { 
              icon: Users, 
              title: 'Community', 
              desc: 'We believe people achieve better results when they support and motivate each other in their fitness journey.' 
            },
          ].map((value, i) => (
            <div 
              key={i} 
              className="bg-accent p-8 rounded-3xl text-center border border-transparent hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <value.icon size={32} />
              </div>
              <h3 className="font-bold text-xl mb-4 text-slate-900">{value.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
