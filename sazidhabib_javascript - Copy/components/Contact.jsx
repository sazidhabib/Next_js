'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import { styles } from '../styles';
import { EarthCanvas } from './canvas';
import SectionWrapper from '../hoc/SectionWrapper';
import { slideIn } from '../utils/motion';
import LoadingSpinner from './LoadingSpinner';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden">
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] glass-card rounded-2xl p-8"
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-500 text-sm font-medium"
          >
            Message sent successfully! I&apos;ll get back to you soon.
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          <label className="flex flex-col">
            <span className="text-[var(--color-text)] font-semibold text-sm mb-2">Your Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className="bg-[var(--color-surface)] py-3.5 px-5 placeholder:text-[var(--color-text-muted)] text-[var(--color-text)] rounded-xl outline-none border border-[var(--color-border)] focus:border-[var(--color-accent)] font-medium text-sm transition-all shadow-xs"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-[var(--color-text)] font-semibold text-sm mb-2">Your Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email address?"
              className="bg-[var(--color-surface)] py-3.5 px-5 placeholder:text-[var(--color-text-muted)] text-[var(--color-text)] rounded-xl outline-none border border-[var(--color-border)] focus:border-[var(--color-accent)] font-medium text-sm transition-all shadow-xs"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-[var(--color-text)] font-semibold text-sm mb-2">Your Message</span>
            <textarea
              rows={6}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What do you want to say?"
              className="bg-[var(--color-surface)] py-3.5 px-5 placeholder:text-[var(--color-text-muted)] text-[var(--color-text)] rounded-xl outline-none border border-[var(--color-border)] focus:border-[var(--color-accent)] font-medium text-sm transition-all resize-none shadow-xs"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-sky-500 hover:bg-sky-600 py-3.5 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-lg shadow-sky-500/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoadingSpinner />
                <span>Sending...</span>
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
