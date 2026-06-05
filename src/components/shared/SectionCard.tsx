interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export default function SectionCard({
  title,
  children,
}: SectionCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:rounded-3xl sm:p-6">

      <h2 className="mb-5 text-lg font-semibold text-white sm:mb-6 sm:text-xl">
        {title}
      </h2>

      {children}

    </div>
  );
}
