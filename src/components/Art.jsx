// Affiche une photo, ou une illustration en dégradé tant qu'il n'y a pas d'image.
export default function Art({ photo, style, alt = "" }) {
  const bg = photo.src ? "#111" : `linear-gradient(${photo.ratio > 1 ? 100 : 165}deg, ${photo.from}, ${photo.to})`;
  return (
    <div className="art" style={{ aspectRatio: photo.ratio || 1, background: bg, ...style }}>
      {photo.src && <img src={photo.src} alt={alt} loading="lazy" />}
    </div>
  );
}
