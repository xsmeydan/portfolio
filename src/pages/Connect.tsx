import { useState } from 'react';
import ConnectShader from '../components/ConnectShader';
import { usePageMeta } from '../hooks/usePageMeta';
import { PAGES } from '../seo/pages';

const CONTACT_FORM_NAME = 'contact';

export default function Connect() {
  usePageMeta(PAGES.connect);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [botField, setBotField] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');

    // Netlify Forms: the static "contact" form in index.html registers the fields at deploy time
    const body = new URLSearchParams({
      'form-name': CONTACT_FORM_NAME,
      'bot-field': botField,
      ...formData,
    });

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (status === 'success' || status === 'error') setStatus('idle');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-16 px-6 relative overflow-hidden">
      <ConnectShader />
      <section className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="font-display-2xl font-bold text-[52px] leading-[56px] sm:text-[80px] sm:leading-[84px] md:text-display-2xl text-primary tracking-tighter text-glow mb-4">
            Let's Connect
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Have a project in mind or just want to chat? Feel free to reach out.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <a href="mailto:sudenurmeydan01@gmail.com" className="inline-flex items-center min-h-[44px] break-all text-on-surface hover:text-primary transition-colors">
                  sudenurmeydan01@gmail.com
                </a>
                <div className="flex flex-wrap gap-x-6 gap-y-1 pt-2">
                  {[
                    { href: 'https://github.com/SMeydan', label: 'GitHub' },
                    { href: 'https://www.linkedin.com/in/sudenur-meydan/', label: 'LinkedIn' },
                    { href: 'https://www.medium.com/@sudenurmeydan01', label: 'Medium' },
                  ].map(({ href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center min-h-[44px] text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary mb-4">Location</h2>
              <p className="text-on-surface-variant">
                Istanbul, Turkey<br />
                Available for remote work worldwide
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <form
            name={CONTACT_FORM_NAME}
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <input type="hidden" name="form-name" value={CONTACT_FORM_NAME} />

            {/* Honeypot: hidden from people, filled in by spam bots */}
            <p className="hidden" aria-hidden="true">
              <label>
                Don&apos;t fill this out:{' '}
                <input
                  name="bot-field"
                  tabIndex={-1}
                  autoComplete="off"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                />
              </label>
            </p>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-on-surface mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                autoComplete="name"
                className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg 
                         text-on-surface focus:outline-none focus:ring-2 focus:ring-primary 
                         focus:border-transparent transition-all"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={200}
                autoComplete="email"
                inputMode="email"
                className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg 
                         text-on-surface focus:outline-none focus:ring-2 focus:ring-primary 
                         focus:border-transparent transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-on-surface mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                maxLength={5000}
                rows={5}
                className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg 
                         text-on-surface focus:outline-none focus:ring-2 focus:ring-primary 
                         focus:border-transparent transition-all resize-none"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full px-6 py-3 bg-primary text-on-primary font-medium rounded-lg 
                       hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary 
                       focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-wait"
            >
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>

            <p role="status" aria-live="polite" className="min-h-[1.5rem] text-sm">
              {status === 'success' && (
                <span className="text-primary-container">
                  Thanks! Your message has been sent. I&apos;ll get back to you soon.
                </span>
              )}
              {status === 'error' && (
                <span className="text-error">
                  Something went wrong. Please try again or email me at{' '}
                  <a href="mailto:sudenurmeydan01@gmail.com" className="underline">
                    sudenurmeydan01@gmail.com
                  </a>
                  .
                </span>
              )}
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
