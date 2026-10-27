import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import Card from "./Card";
import Button from "./Button";

export default function RecipeCard({ recipe: m, saved = false, onToggleSave }) {
  const navigate = useNavigate();

  return (
    <Card
      padding="none"
      variant="default"
      className="group flex flex-col overflow-hidden transition-all duration-300 hover:border-secondary hover:shadow-lg hover:shadow-soft"
    >
      <div className="relative h-70 w-full overflow-hidden">
        <img
          src={m.image}
          alt={m.title}
          className="h-full w-full rounded-t-xl object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <span className="absolute bottom-3 right-3 z-10 rounded-xl bg-white/90 px-3 py-1.5 text-sm font-bold text-gray-800 shadow-sm backdrop-blur-sm">
          {m.time}
        </span>

        {onToggleSave && (
          <button
            type="button"
            onClick={() => onToggleSave(m.id)}
            aria-pressed={saved}
            aria-label={saved ? `Hapus ${m.title} dari tersimpan` : `Simpan ${m.title}`}
            className="absolute right-3 top-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition hover:scale-110"
          >
            <Bookmark size={18} className={saved ? "fill-primary text-primary" : "text-gray-600"} />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h4 className="text-sm font-bold text-primary">{m.category}</h4>
        <h3 className="text-xl font-bold leading-snug text-text">{m.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">{m.desc}</p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm font-semibold text-gray-800">
            {m.kcal} • {m.protein}
          </span>
          <Button
          variant="noborder"
          size="sm"
            type="button"
            onClick={() => navigate(`/nutrition/recipeId`)}
            className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-secondary hover:text-primary hover:underline"
          >
            Lihat Resep <span aria-hidden="true">&rarr;</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}