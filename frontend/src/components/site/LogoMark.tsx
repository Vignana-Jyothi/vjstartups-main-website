// The VJ Startups mark: V, a rocket for the I, and J. Drawn as paths (traced from the final logo)
// so it takes the colour of whatever it sits on: the letters use currentColor, and the rocket uses
// --logo-rocket, which defaults to the brand lime and turns ink on light backgrounds.
export const LOGO_PATHS = {
  v: "M152 247H252L344 487L374 416H465L342 697Z",
  rocket:
    "M545 106C574 136 600 188 601 280V420C601 452 650 470 650 510L641 588L579 535L545 697L511 535L451 588L440 510C440 470 489 452 489 420V280C490 188 516 136 545 106Z",
  j: "M807 245H905V520C905 628 840 692 752 692C700 692 660 672 634 642L684 571L712 574C722 588 734 595 750 595C782 595 807 568 807 520Z",
};
export const LOGO_VIEWBOX = "140 100 776 606";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg className={`logo-mark ${className}`.trim()} viewBox={LOGO_VIEWBOX} aria-hidden="true" focusable="false">
      <path d={LOGO_PATHS.v} fill="currentColor" />
      <path className="logo-rocket" d={LOGO_PATHS.rocket} fill="var(--logo-rocket, #d7ff63)" />
      <path d={LOGO_PATHS.j} fill="currentColor" />
    </svg>
  );
}
