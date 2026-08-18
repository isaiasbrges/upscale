export type HeroPremiumConfig = {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  backgroundUrl: string;
  accentColor: string;
};

export function HeroPremium(props: HeroPremiumConfig) {
  const {
    eyebrow, title, highlight, subtitle,
    buttonText, buttonUrl, backgroundUrl, accentColor
  } = props;

  return (
    <section
      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-neutral-950 px-6 py-20 text-white md:px-12"
      style={{
        backgroundImage: backgroundUrl
          ? `linear-gradient(90deg, rgba(0,0,0,.88), rgba(0,0,0,.48)), url(${backgroundUrl})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 max-w-3xl">
        <div className="mb-5 text-xs font-bold uppercase tracking-[0.24em]" style={{color: accentColor}}>
          {eyebrow}
        </div>

        <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.04em] md:text-7xl">
          {title}{" "}
          <span style={{color: accentColor}}>{highlight}</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
          {subtitle}
        </p>

        <a
          href={buttonUrl || "#"}
          className="mt-8 inline-flex min-h-14 items-center justify-center rounded-xl px-7 text-sm font-black uppercase tracking-wide text-black transition hover:scale-[1.02]"
          style={{backgroundColor: accentColor}}
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}
