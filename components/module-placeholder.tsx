import { PageHeader } from "./page-components";

export function ModulePlaceholder({
  eyebrow,
  title,
  description,
  items
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="grid grid-3">
        {items.map((item) => (
          <article className="card" key={item}>
            <h3 className="section-title">{item}</h3>
            <p className="muted">Tenant-scoped workflow surface ready for API wiring and MongoDB persistence.</p>
          </article>
        ))}
      </div>
    </>
  );
}
