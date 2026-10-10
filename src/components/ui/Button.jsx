export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-primary text-surface border hover:bg-hover",
    outline: "bg-surface border border-secondary text-secondary hover:bg-soft",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "text-gray-600 hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-4 py-2",
    md: "px-8 py-3",
    lg: "px-10 py-3",
    xl: "px-10 py-4"
  };

  return (
    <button
      className={`rounded-xl font-medium text-lg cursor-pointer transition ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? "Memuat..." : children}
    </button>
  );
}