import Button from "./Button";

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="mx-4 flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 p-10 text-center md:mx-6">
      {Icon && <Icon size={40} className="text-primary" />}
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="max-w-sm text-sm text-gray-500">{description}</p>
      {actionLabel && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}