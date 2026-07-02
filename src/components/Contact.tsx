"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Download,
  ArrowUpRight,
  Send,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

    if (!serviceId || !templateId || !publicKey) {
      console.warn("EmailJS credentials missing. Simulating submission in development.");
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormState({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      }, 1500);
      return;
    }

    const templateParams = {
      // Name conventions
      from_name: formState.name,
      user_name: formState.name,
      name: formState.name,

      // Email conventions
      reply_to: formState.email,
      from_email: formState.email,
      user_email: formState.email,
      email: formState.email,

      // Message conventions
      message: formState.message,
      user_message: formState.message,
      msg: formState.message,

      // Recipient / Metadata
      to_name: "Goutham Krishna P S",
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then(
        () => {
          setIsSubmitting(false);
          setSubmitted(true);
          setFormState({ name: "", email: "", message: "" });
          setTimeout(() => setSubmitted(false), 5000);
        },
        (err) => {
          console.error("EmailJS Error Details:", err);
          setIsSubmitting(false);
          
          // Extract message if it exists
          const errorMsg = err && typeof err === "object" && ("text" in err || "message" in err)
            ? (err.text || (err as any).message)
            : JSON.stringify(err);

          setSubmitError(`Failed to send message: ${errorMsg || "Please try again."}`);
          setTimeout(() => setSubmitError(null), 5000);
        }
      );
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen py-20 sm:py-32 bg-bg-primary overflow-hidden"
    >
      {/* Decorative glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute top-1/4 left-0 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      {/* Huge Background Mask Text */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <h2 className="absolute -left-10 bottom-10 text-[100px] sm:text-[180px] lg:text-[250px] font-black text-text-mask tracking-widest leading-none">
          CONTACT
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 relative z-10">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-cyan-400 font-bold uppercase tracking-[4px] text-xs sm:text-sm">
            Get In Touch
          </span>

          <h2 className="mt-4 text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] uppercase tracking-tight">
            Let's build
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500">
              something amazing
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 sm:gap-16 mt-16 sm:mt-24">
          
          {/* Left Column: Availabilities & Socials */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-10"
          >
            <div>
              <h3 className="text-2xl font-black uppercase text-slate-900 dark:text-white tracking-wide">
                Available For
              </h3>
              
              <div className="mt-6 space-y-3">
                {[
                  "Frontend Development Contracts",
                  "Next.js/React Optimizations",
                  "Remote Roles (Global)",
                  "Custom WebGL / Three.js Projects",
                  "UI Architecture Audits",
                ].map((item) => (
                  <div
                    key={item}
                    className="glass-panel px-5 py-4 rounded-xl border border-surface-border text-sm sm:text-base font-semibold text-text-secondary transition-colors hover:text-slate-900 dark:hover:text-white"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links List */}
            <div className="space-y-4 border-t border-surface-border/40 pt-8">
              {[
                { icon: Mail, label: "Email", val: "gouthamkrishnaps02@gmail.com", href: "mailto:gouthamkrishnaps02@gmail.com", download: false },
                { icon: Phone, label: "Phone", val: "+91 9746594311", href: "tel:+919746594311", download: false },
                { icon: FaLinkedin, label: "LinkedIn", val: "gouthamkrishnaps", href: "https://linkedin.com/in/gouthamkrishnaps", download: false },
                { icon: FaGithub, label: "GitHub", val: "gouthamkrishnaps", href: "https://github.com/gouthamkrishnaps", download: false },
                { icon: Download, label: "Resume", val: "Download PDF", href: "/resume/Goutham_Krishna_PS.pdf", download: true },
              ].map((link, idx) => {
                const Icon = link.icon;
                return (
                  <a
                    key={idx}
                    href={link.href}
                    download={link.download}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between border-b border-surface-border/50 pb-3 hover:border-cyan-400 group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-surface border border-surface-border text-text-muted group-hover:text-cyan-400 group-hover:border-cyan-500/35 transition-colors">
                        <Icon size={16} />
                      </div>
                      <div className="text-left">
                        <span className="block text-xs text-text-muted leading-none uppercase font-bold tracking-wider">{link.label}</span>
                        <span className="text-sm font-semibold text-text-secondary group-hover:text-slate-900 group-hover:dark:text-white transition-colors">{link.val}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="text-text-muted group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" size={16} />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Premium Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              className="glass-panel p-8 sm:p-10 rounded-[30px] border border-surface-border glowing-border-parent relative"
            >
              <div className="glowing-border-glow" />
              <h3 className="text-2xl font-black uppercase text-slate-900 dark:text-white tracking-wide mb-6">
                Send a Message
              </h3>

              <div className="space-y-6">
                
                {/* Name Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="form-name" className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Full Name
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    suppressHydrationWarning
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-5 py-4 rounded-xl border border-surface-border bg-surface-raised/40 text-slate-900 dark:text-white placeholder-text-tertiary focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all font-semibold"
                  />
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="form-email" className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Email Address
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    suppressHydrationWarning
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-5 py-4 rounded-xl border border-surface-border bg-surface-raised/40 text-slate-900 dark:text-white placeholder-text-tertiary focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all font-semibold"
                  />
                </div>

                {/* Message Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="form-msg" className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Project details
                  </label>
                  <textarea
                    id="form-msg"
                    rows={5}
                    required
                    suppressHydrationWarning
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell me about your project, goals, or schedule..."
                    className="w-full px-5 py-4 rounded-xl border border-surface-border bg-surface-raised/40 text-slate-900 dark:text-white placeholder-text-tertiary focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all font-semibold resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="relative">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    suppressHydrationWarning
                    className="w-full flex items-center justify-center gap-2.5 px-8 py-4.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      "Sending Message..."
                    ) : submitted ? (
                      "Message Sent Successfully!"
                    ) : (
                      <>
                        Send Message
                        <Send size={14} />
                      </>
                    )}
                  </button>

                  {submitError && (
                    <p className="text-red-400 font-mono text-xs text-center mt-3 animate-pulse uppercase tracking-wider">
                      {submitError}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}