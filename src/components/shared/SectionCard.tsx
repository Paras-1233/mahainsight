interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export default function SectionCard({
  title,
  children,
}: SectionCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">

      <h2 className="text-xl font-semibold mb-6 text-white">
        {title}
      </h2>

      {children}

    </div>
  );
}