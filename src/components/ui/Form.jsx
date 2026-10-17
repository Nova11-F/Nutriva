export default function Form({
  id,
  title,       
  onSubmit,
  children,    
  footer,      
  className = "",
}) {
  return (
    <form
      id={id}
      onSubmit={onSubmit}
      noValidate
      className={`w-full rounded-xl border border-gray-100 bg-surface p-6 shadow-md md:px-10 md:py-8 ${className}`}
    >
      {title && <h2 className="mb-4 text-sm font-semibold text-text">{title}</h2>}

      <div className="space-y-4">{children}</div>

      {footer && <div className="mt-6">{footer}</div>}
    </form>
  );
}