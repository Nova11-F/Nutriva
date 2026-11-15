/**
 * Daftar lengkap 40 slug resep yang memiliki foto unik 1-per-1 di `public/images/recipes/<slug>.jpg`.
 * Tambahkan slug ke Set ini jika file `<slug>.jpg` baru ditambahkan ke folder tersebut.
 */
export const EXACT_RECIPE_IMAGE_SLUGS = new Set([
  "bakso-daging-pisang",
  "bola-bola-nasi-rabuk-ikan",
  "bubur-ayam-wortel",
  "bubur-daging-sapi-wortel",
  "bubur-ikan-jagung",
  "bubur-kanju-rumbi-ayam-udang",
  "bubur-saring-hati-ayam",
  "bubur-singkong-isi-ikan-ayam-saus-jeruk",
  "bubur-soto-ayam-santan",
  "bubur-sup-ayam-kacang-merah",
  "ikan-bakar-balita",
  "mie-kukus-telur-puyuh",
  "nasi-ayam-katsu-tumis-sayur-melon",
  "nasi-bakar-ayam-santan",
  "nasi-bakar-ikan-tongkol-pepaya",
  "nasi-ikan-kuah-kuning",
  "nasi-masak-ayam-kecap-sayur",
  "nasi-soto-ayam-kuah-kuning",
  "nasi-sup-tabas-udang-sayur",
  "nasi-sup-telur-puyuh-bola-tahu-ayam",
  "nasi-tim-ayam-lele-cincang",
  "nasi-tim-ikan-kembung-labu",
  "nasi-tim-ikan-telur-puyuh-wortel",
  "nasi-tim-ikan-telur-sayuran",
  "nasi-tim-ikan-tuna-telur-puyuh",
  "nugget-sayuran",
  "nugget-tempe-ayam-sayuran",
  "omelet-mie-ceria",
  "pepes-tahu",
  "pudding-ubi-ungu",
  "puding-kentang-ayam-telur",
  "puree-hati-ayam-bayam",
  "roti-goreng-isi-ragout-ayam-sayuran",
  "salmon-chowder-jagung",
  "smoothie-alpukat-pisang",
  "stick-ikan-sayur-renyah",
  "sup-bola-telur-puyuh-sayur",
  "sup-telur-puyuh-ikan-nila-labu-kuning",
  "tim-bubur-manado-daging-udang",
  "tim-ikan-menado",
]);

export const RECIPE_FALLBACK_IMAGE = "/images/recipes/bubur-ayam-wortel.jpg";

function toSlug(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function matchByTitleKeyword(title) {
  const t = String(title || "").toLowerCase();
  if (t.includes("pepes")) return "/images/recipes/pepes-tahu.jpg";
  if (t.includes("ikan bakar")) return "/images/recipes/ikan-bakar-balita.jpg";
  if (t.includes("bakar") && t.includes("ikan")) return "/images/recipes/nasi-bakar-ikan-tongkol-pepaya.jpg";
  if (t.includes("bakar")) return "/images/recipes/nasi-bakar-ayam-santan.jpg";
  if (t.includes("stick")) return "/images/recipes/stick-ikan-sayur-renyah.jpg";
  if (t.includes("katsu")) return "/images/recipes/nasi-ayam-katsu-tumis-sayur-melon.jpg";
  if (t.includes("roti") || t.includes("ragout")) return "/images/recipes/roti-goreng-isi-ragout-ayam-sayuran.jpg";
  if (t.includes("nugget")) return "/images/recipes/nugget-tempe-ayam-sayuran.jpg";
  if (t.includes("kukus") && t.includes("mie")) return "/images/recipes/mie-kukus-telur-puyuh.jpg";
  if (t.includes("omelet") || t.includes("mie")) return "/images/recipes/omelet-mie-ceria.jpg";
  if (t.includes("soto")) return "/images/recipes/nasi-soto-ayam-kuah-kuning.jpg";
  if (t.includes("kuah kuning")) return "/images/recipes/nasi-ikan-kuah-kuning.jpg";
  if (t.includes("nila") || t.includes("labu kuning")) {
    return "/images/recipes/sup-telur-puyuh-ikan-nila-labu-kuning.jpg";
  }
  if (t.includes("tabas")) return "/images/recipes/nasi-sup-tabas-udang-sayur.jpg";
  if (t.includes("sup")) return "/images/recipes/sup-bola-telur-puyuh-sayur.jpg";
  if (t.includes("nasi tim") && t.includes("kembung")) return "/images/recipes/nasi-tim-ikan-kembung-labu.jpg";
  if (t.includes("nasi tim") && t.includes("tuna")) return "/images/recipes/nasi-tim-ikan-tuna-telur-puyuh.jpg";
  if (t.includes("nasi tim") && t.includes("ikan")) return "/images/recipes/nasi-tim-ikan-telur-sayuran.jpg";
  if (t.includes("nasi tim")) return "/images/recipes/nasi-tim-ayam-lele-cincang.jpg";
  if (t.includes("kecap")) return "/images/recipes/nasi-masak-ayam-kecap-sayur.jpg";
  if (t.includes("rabuk") || t.includes("bola-bola nasi")) return "/images/recipes/bola-bola-nasi-rabuk-ikan.jpg";
  if (t.includes("menado")) return "/images/recipes/tim-ikan-menado.jpg";
  if (t.includes("manado")) return "/images/recipes/tim-bubur-manado-daging-udang.jpg";
  if (t.includes("ubi ungu")) return "/images/recipes/pudding-ubi-ungu.jpg";
  if (t.includes("puding") || t.includes("pudding")) return "/images/recipes/puding-kentang-ayam-telur.jpg";
  if (t.includes("smoothie") || t.includes("alpukat")) return "/images/recipes/smoothie-alpukat-pisang.jpg";
  if (t.includes("hati") && t.includes("puree")) return "/images/recipes/puree-hati-ayam-bayam.jpg";
  if (t.includes("hati")) return "/images/recipes/bubur-saring-hati-ayam.jpg";
  if (t.includes("bubur") && t.includes("jagung")) return "/images/recipes/bubur-ikan-jagung.jpg";
  if (t.includes("chowder") || t.includes("jagung")) return "/images/recipes/salmon-chowder-jagung.jpg";
  if (t.includes("sapi")) return "/images/recipes/bubur-daging-sapi-wortel.jpg";
  if (t.includes("santan")) return "/images/recipes/bubur-soto-ayam-santan.jpg";
  return null;
}

/**
 * Mengembalikan URL foto real-food sesuai slug/judul resep, dengan fallback aman.
 */
export function getRecipeImage(recipeOrSlug) {
  if (!recipeOrSlug) return RECIPE_FALLBACK_IMAGE;

  if (typeof recipeOrSlug === "string") {
    const clean = toSlug(recipeOrSlug);
    if (EXACT_RECIPE_IMAGE_SLUGS.has(clean)) return `/images/recipes/${clean}.jpg`;
    return matchByTitleKeyword(recipeOrSlug) || RECIPE_FALLBACK_IMAGE;
  }

  const slug = toSlug(recipeOrSlug.slug);
  if (slug && EXACT_RECIPE_IMAGE_SLUGS.has(slug)) {
    return `/images/recipes/${slug}.jpg`;
  }

  const titleSlug = toSlug(recipeOrSlug.title);
  if (titleSlug && EXACT_RECIPE_IMAGE_SLUGS.has(titleSlug)) {
    return `/images/recipes/${titleSlug}.jpg`;
  }

  return (
    matchByTitleKeyword(recipeOrSlug.title) ||
    recipeOrSlug.image_url ||
    recipeOrSlug.image ||
    RECIPE_FALLBACK_IMAGE
  );
}

/**
 * Handler `onError` untuk <img> agar tidak menampilkan ikon gambar rusak.
 */
export function handleRecipeImgError(e) {
  if (e?.currentTarget && e.currentTarget.dataset.fallbackApplied !== "1") {
    e.currentTarget.dataset.fallbackApplied = "1";
    e.currentTarget.src = RECIPE_FALLBACK_IMAGE;
  }
}
