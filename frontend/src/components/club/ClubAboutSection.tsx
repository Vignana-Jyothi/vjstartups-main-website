import { useSiteContent } from "@/data/siteContent";

export function ClubAboutSection() {
  const { club } = useSiteContent();
  return (
    <section className="lx-block">
      <div className="lx-sec-head">
        <span>01 / About</span>
        <h2>About the club</h2>
      </div>
      <p className="lx-lead">{club.description}</p>
      <div className="lx-pair">
        <div className="lx-field">
          <h3>Our mission</h3>
          <p>{club.mission}</p>
        </div>
        <div className="lx-field">
          <h3>Our vision</h3>
          <p>{club.vision}</p>
        </div>
      </div>
    </section>
  );
}
