type InfoCardProps = {
  title: string;
  description: string;
};

export function InfoCard({ title, description }: InfoCardProps) {
  return (
    <article className="surface-card h-full">
      <div className="space-y-3 p-6">
        <h3 className="text-2xl font-semibold leading-tight text-base-content">{title}</h3>
        <p className="text-sm leading-7 text-base-content/72 sm:text-[0.97rem]">{description}</p>
      </div>
    </article>
  );
}
