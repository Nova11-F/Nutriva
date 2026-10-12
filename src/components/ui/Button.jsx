import Spinner from "./Spinner";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-primary text-surface hover:bg-hover",
    outline: "bg-surface border border-gray-300 hover:bg-secondary hover:text-surface",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "text-gray-600 hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-4 py-2",
    md: "px-8 py-3",
    lg: "px-10 py-3",
    xl: "px-10 py-4",
  };

  return (
    <button
      className={`rounded-xl font-bold text-lg cursor-pointer hover:shadow-lg transition duration-300 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Spinner size="sm" className="text-current" />
          Memuat...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
