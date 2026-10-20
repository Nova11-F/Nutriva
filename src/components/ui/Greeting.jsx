export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 4 && hour < 11) return "Selamat pagi";
  if (hour >= 11 && hour < 15) return "Selamat siang";
  if (hour >= 15 && hour < 18) return "Selamat sore";
  return "Selamat malam";
}

export default function Greeting({
  userName = "",
  className = "",
  as: Tag = "h1",
  ...props
}) {
  const greeting = getGreeting();
  const text = userName ? `${greeting}, ${userName}!` : `${greeting}!`;

  return (
    <Tag
      className={`text-xl font-bold text-text md:text-3xl ${className}`}
      {...props}
    >
      {text}
    </Tag>
  );
}