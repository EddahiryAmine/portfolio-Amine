// Liste éditoriale : titre à gauche, texte au milieu, date à droite.
export default function Section({ id, title, items, first }) {
  return (
    <section id={id} style={first ? undefined : { paddingTop: 0 }}>
      <div className="wrap">
        <h2>{title}</h2>
        {items.map((it) => (
          <div className={"row" + (it.current ? " cur" : "")} key={it.title}>
            <div>
              <h3>{it.title}</h3>
              {it.place && <small>{it.place}</small>}
            </div>
            <p>{it.text}</p>
            <small>{it.date}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
