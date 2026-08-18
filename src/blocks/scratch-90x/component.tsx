export type Scratch90xConfig = {
  title: string;
  subtitle: string;
  buttonText: string;
  sound: boolean;
  confetti: boolean;
  accentColor: string;
};

export function Scratch90x({
  title,
  subtitle,
  buttonText,
  sound,
  confetti,
  accentColor
}: Scratch90xConfig) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-neutral-950 p-6 text-white">
      <div className="mx-auto max-w-md text-center">
        <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{color: accentColor}}>
          Bloco gamificado
        </div>
        <h2 className="mt-3 text-3xl font-black">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-white/60">{subtitle}</p>

        <div className="mx-auto mt-7 grid max-w-[300px] grid-cols-3 gap-2">
          {Array.from({length: 9}).map((_, index) => (
            <div
              key={index}
              className="aspect-square rounded-xl border border-white/10 bg-gradient-to-br from-neutral-700 to-neutral-900"
            />
          ))}
        </div>

        <button
          className="mt-7 w-full rounded-xl px-5 py-4 font-black uppercase text-black"
          style={{backgroundColor: accentColor}}
        >
          {buttonText}
        </button>

        <div className="mt-3 text-xs text-white/35">
          Som: {sound ? "ativo" : "desativado"} · Confete: {confetti ? "ativo" : "desativado"}
        </div>
      </div>
    </section>
  );
}
