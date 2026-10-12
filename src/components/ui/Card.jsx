export default function Card({
  children,
  variant = "default",
  padding = "md",
  hoverable = false,
  className = "",
  ...props
}) {
  const variants = {
    default: "bg-surface border-2 border-gray-300",
    soft: "bg-soft border border-gray-200",
    silver: "bg-background border border-soft",
    success: "bg-green-50 border border-green-200",
    warning: "bg-yellow-50 border border-yellow-300",
    danger: "bg-red-50 border border-red-200",
    outline: "bg-transparent border-2 border-gray-300",
  };

  const paddings = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-8",
  };

  return (
    <div
      className={`rounded-xl transition-all duration-300 ${variants[variant]} ${paddings[padding]} ${
        hoverable ? "transition hover:-translate-y-1 hover:shadow-lg" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}