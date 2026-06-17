export default function Footer() {
  return (
    <footer className="border-t border-surface-border py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between gap-3 md:gap-4 text-sm sm:text-base">
        <div className="text-center md:text-left">
          © {new Date().getFullYear()} Goutham Krishna P S
        </div>

        <div className="text-text-muted text-center md:text-left">
          Built with Next.js, TypeScript,
          Tailwind CSS & Framer Motion
        </div>
      </div>
    </footer>
  );
}