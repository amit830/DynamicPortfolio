'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Stats = {
  projects: number;
  skills: number;
  experience: number;
  testimonials: number;
  messages: number;
  unreadMessages: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    skills: 0,
    experience: 0,
    testimonials: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projectsRes, skillsRes, experienceRes, testimonialsRes, messagesRes, unreadRes] =
          await Promise.all([
            supabase.from('projects').select('id', { count: 'exact', head: true }),
            supabase.from('skills').select('id', { count: 'exact', head: true }),
            supabase.from('experience').select('id', { count: 'exact', head: true }),
            supabase.from('testimonials').select('id', { count: 'exact', head: true }),
            supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
            supabase
              .from('contact_messages')
              .select('id', { count: 'exact', head: true })
              .eq('read', false),
          ]);

        setStats({
          projects: projectsRes.count || 0,
          skills: skillsRes.count || 0,
          experience: experienceRes.count || 0,
          testimonials: testimonialsRes.count || 0,
          messages: messagesRes.count || 0,
          unreadMessages: unreadRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const cards = [
    { title: 'Projects', count: stats.projects, href: '/admin/projects', color: 'bg-blue-500' },
    { title: 'Skills', count: stats.skills, href: '/admin/skills', color: 'bg-green-500' },
    { title: 'Experience', count: stats.experience, href: '/admin/experience', color: 'bg-yellow-500' },
    { title: 'Testimonials', count: stats.testimonials, href: '/admin/testimonials', color: 'bg-red-500' },
    { title: 'Messages', count: stats.messages, href: '/admin/messages', color: 'bg-slate-500', badge: stats.unreadMessages },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.count}</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center relative`}>
                <span className="text-white font-bold text-xl">{card.count}</span>
                {card.badge !== undefined && card.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {card.badge}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/projects"
            className="bg-slate-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors text-center"
          >
            Add New Project
          </Link>
          <Link
            href="/admin/skills"
            className="bg-slate-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors text-center"
          >
            Add New Skill
          </Link>
          <Link
            href="/admin/experience"
            className="bg-slate-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors text-center"
          >
            Add Experience
          </Link>
        </div>
      </div>
    </div>
  );
}
