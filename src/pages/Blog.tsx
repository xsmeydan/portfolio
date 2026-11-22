import { useState } from 'react';

export default function Blog() {
  const blogPosts: {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    imageUrl: string;
    link: string | null;
  }[] = [
    {
      id: 1,
      title: 'Getting Started with Neural Networks',
      excerpt: 'A beginner-friendly guide to understanding and implementing neural networks. Learn the basics of layers, activation functions, and training models.',
      date: '2024-01-15',
      readTime: '5 min read',
      category: 'AI',
      imageUrl: '/gradient.webp',
      link: '/blog/neural-networks.html'
    },
    {
      id: 2,
      title: 'Building Scalable Backend Systems',
      excerpt: 'Lessons learned from building production-grade backend services. Topics include architecture patterns, database design, and API best practices.',
      date: '2024-01-10',
      readTime: '8 min read',
      category: 'Backend',
      imageUrl: '/gradient.webp',
      link: null
    },
    {
      id: 3,
      title: 'Exploring AI in Modern Software Development',
      excerpt: 'How artificial intelligence is changing the way we write and think about code. From code completion to automated testing, discover the possibilities.',
      date: '2024-01-05',
      readTime: '6 min read',
      category: 'AI',
      imageUrl: '/gradient.webp',
      link: null
    },
    {
      id: 4,
      title: 'The Art of Clean Code',
      excerpt: 'Writing code that is not only functional but also maintainable and readable. Tips and techniques for improving your code quality.',
      date: '2023-12-28',
      readTime: '4 min read',
      category: 'Best Practices',
      imageUrl: '/gradient.webp',
      link: null
    },
    {
      id: 5,
      title: 'Microservices vs Monolith: Making the Right Choice',
      excerpt: 'A deep dive into the trade-offs between microservices and monolithic architectures. When to use each and how to transition effectively.',
      date: '2023-12-20',
      readTime: '7 min read',
      category: 'Architecture',
      imageUrl: '/gradient.webp',
      link: null
    },
    {
      id: 6,
      title: 'Optimizing Database Performance',
      excerpt: 'Strategies and techniques for improving database query performance. Indexing, caching, and query optimization essentials.',
      date: '2023-12-15',
      readTime: '6 min read',
      category: 'Database',
      imageUrl: '/gradient.webp',
      link: null
    }
  ];

  const categories = ['All', 'Backend', 'AI', 'Best Practices', 'Architecture', 'Database'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-16 px-6">
      <section className="max-w-[1440px] mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="font-display-2xl font-bold text-[52px] leading-[56px] sm:text-[80px] sm:leading-[84px] md:text-display-2xl text-primary tracking-tighter text-glow mb-4">
            Blog
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about software development, AI, and technology.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium transition-all
                ${selectedCategory === category 
                  ? 'bg-primary text-on-primary' 
                  : 'bg-surface text-on-surface-variant hover:bg-surface-variant'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-[300px] md:auto-rows-[280px]">
          {filteredPosts.map((post, i) => {
            const isLarge = i === 0 || i === 3 || i === 4;

            const content = (
              <>
                <img
                  src={post.imageUrl}
                  alt=""
                  loading={i < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-90 transition-opacity"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-label-mono text-label-mono text-secondary-fixed-dim mb-2 uppercase tracking-widest">
                      {post.category} · {post.link ? post.readTime : 'Coming soon'}
                    </div>

                    <h2 className="font-headline-md text-[26px] leading-[32px] md:font-display-lg-mobile md:text-display-lg-mobile text-primary">
                      {post.title}
                    </h2>

                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  {post.link && (
                    <div className="w-10 h-10 rounded-full border border-surface-variant flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-background transition-colors">
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                        arrow_outward
                      </span>
                    </div>
                  )}
                </div>
              </>
            );

            const cardClass = `glass-card rounded-xl overflow-hidden group relative block ${
              isLarge ? 'md:col-span-2' : 'md:col-span-1'
            }`;

            return post.link ? (
              <a
                key={post.id}
                href={post.link}
                className={`${cardClass} cursor-hover`}
              >
                {content}
              </a>
            ) : (
              <article key={post.id} className={`${cardClass} opacity-70`} aria-disabled="true">
                {content}
              </article>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-on-surface-variant">No posts found in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
}
