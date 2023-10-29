import Constants from "../../util/constants";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="title">About</div>
        <div className="description" style={{ textAlign: "justify" }}>
          {Constants.kanbanBoardDesc}
        </div>
        <div className="about-dev">
          <a
            className="dev-name"
            href="https://www.linkedin.com/in/praneeth-k-89618497/?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3B8rnwlEqnT3K9VDqZ4gtyBg%3D%3D"
          >
            Praneeth
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;
