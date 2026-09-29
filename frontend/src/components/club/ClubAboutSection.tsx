import { clubInfo } from "@/data/clubInfo";

export function ClubAboutSection() {
  return (
    <section className="lx-block">
      <div className="lx-sec-head">
        <span>01 / About</span>
        <h2>About the club</h2>
      </div>
      <p className="lx-lead">{clubInfo.description}</p>
      <div className="lx-pair">
        <div className="lx-field">
          <h3>Our mission</h3>
          <p>{clubInfo.mission}</p>
        </div>
        <div className="lx-field">
          <h3>Our vision</h3>
          <p>{clubInfo.vision}</p>
        </div>
      </div>
    </section>
  );
}
