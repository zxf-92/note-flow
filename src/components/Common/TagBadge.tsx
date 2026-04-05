interface TagBadgeProps {
  name: string;
  color: string;
  onRemove?: () => void;
  onClick?: () => void;
  size?: "sm" | "md";
  selected?: boolean;
}

export default function TagBadge({
  name,
  color,
  onRemove,
  onClick,
  size = "sm",
  selected,
}: TagBadgeProps) {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full font-medium transition-all duration-300 ${sizeClasses} ${
        onClick ? "cursor-pointer hover:opacity-80" : ""
      } ${selected ? "ring-2 ring-offset-1" : ""}`}
      style={{ backgroundColor: `${color}20`, color }}
    >
      {name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:opacity-70"
        >
          ×
        </button>
      )}
    </span>
  );
}
