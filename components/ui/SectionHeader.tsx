interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
}

export function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center gap-3 mb-12 md:mb-16">
      {label && (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-500 dark:text-violet-400 uppercase tracking-widest">
          <span className="w-4 h-px bg-sky-500 dark:bg-violet-400" />
          {label}
          <span className="w-4 h-px bg-sky-500 dark:bg-violet-400" />
        </span>
      )}
      <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl text-base md:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
