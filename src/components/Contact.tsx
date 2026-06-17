"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Download,
  ArrowUpRight,
  Link2,
  GitFork,
} from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative min-h-screen py-20 sm:py-32 overflow-hidden"
    >
      {/* Background Text */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <h1
          className="
          absolute
          -left-10
          sm:left-0
          top-10
          text-[100px]
          sm:text-[150px]
          md:text-[250px]
          lg:text-[350px]
          font-black
          text-text-mask
          leading-none
          select-none"
        >
          CONTACT
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
        >
          <span className="text-brand-400 uppercase tracking-[4px] text-sm">
            Get In Touch
          </span>

          <h2
            className="
            mt-4 sm:mt-6
            text-5xl
            sm:text-6xl
            md:text-8xl
            lg:text-9xl
            font-black
            leading-[0.9]"
          >
            LET'S BUILD
            <br />
            SOMETHING
            <br />
            AMAZING
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 mt-12 sm:mt-20">
          {/* Left */}

          <motion.div
            initial={{
              opacity: 0,
              x: -50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold">
              Available For
            </h3>

            <div className="mt-6 sm:mt-10 space-y-4 sm:space-y-6">
              {[
                "Frontend Development",
                "Next.js Projects",
                "Remote Opportunities",
                "Freelance Projects",
                "UI Engineering",
              ].map((item) => (
                <div
                  key={item}
                  className="
                  rounded-2xl
                  border
                  border-surface-border
                  bg-surface
                  backdrop-blur-md
                  px-5
                  sm:px-6
                  py-4
                  sm:py-5
                  text-sm sm:text-base"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right */}

          <motion.div
            initial={{
              opacity: 0,
              x: 50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
          >
            <div className="space-y-6 sm:space-y-8">
              <a
                href="mailto:gouthamkrishnaps02@gmail.com"
                className="
                flex
                items-center
                justify-between
                border-b
                border-surface-border
                pb-5"
              >
                <div className="flex items-center gap-4">
                  <Mail size={20} />
                  <span>Email</span>
                </div>

                <ArrowUpRight />
              </a>

              <a
                href="tel:+919746594311"
                className="
                flex
                items-center
                justify-between
                border-b
                border-surface-border
                pb-5"
              >
                <div className="flex items-center gap-4">
                  <Phone size={20} />
                  <span>Phone</span>
                </div>

                <ArrowUpRight />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                className="
                flex
                items-center
                justify-between
                border-b
                border-surface-border
                pb-5"
              >
                <div className="flex items-center gap-4">
                  <Link2 size={20} />
                  <span>LinkedIn</span>
                </div>

                <ArrowUpRight />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                className="
                flex
                items-center
                justify-between
                border-b
                border-surface-border
                pb-5"
              >
                <div className="flex items-center gap-4">
                  <GitFork size={20} />
                  <span>GitHub</span>
                </div>

                <ArrowUpRight />
              </a>

              <a
                href="/resume/Goutham_Krishna_PS.pdf"
                download
                className="
                flex
                items-center
                justify-between
                border-b
                border-surface-border
                pb-5"
              >
                <div className="flex items-center gap-4">
                  <Download size={20} />
                  <span>Resume</span>
                </div>

                <ArrowUpRight />
              </a>
            </div>

            <button
              className="
              mt-8 sm:mt-12
              bg-brand-600
              hover:bg-brand-700
              transition
              px-8 sm:px-10
              py-4 sm:py-5
              rounded-2xl
              font-semibold
              w-full sm:w-auto
              text-sm sm:text-base"
            >
              Get In Touch
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}