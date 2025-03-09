// ContactForm.js
import { useState } from 'react';
import styles from './ContactForm.module.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '', // Honeypot field (bots will see this)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Honeypot check
    if (formData.website !== '') {
      console.log('Bot detected');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', email: '', message: '', website: '' });
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Get in Touch</h1>
        <p>We'll get back to you within 24 hours</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Honeypot Field */}
        <div className={styles.honeypot}>
          <label htmlFor="website">Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex="-1"
            autoComplete="off"
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <label htmlFor="name" className={styles.label}>Full Name</label>
        </div>

        <div className={styles.formGroup}>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <label htmlFor="email" className={styles.label}>Email Address</label>
        </div>

        <div className={styles.formGroup}>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className={styles.textarea}
          />
          <label htmlFor="message" className={styles.label}>Your Message</label>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
          {isSubmitting && <div className={styles.spinner} />}
        </button>

        {submitStatus === 'success' && (
          <div className={styles.successMessage}>
            ✓ Message sent successfully!
          </div>
        )}
        {submitStatus === 'error' && (
          <div className={styles.errorMessage}>
            ⚠️ Failed to send message. Please try again.
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;