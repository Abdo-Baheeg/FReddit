import React from "react";
import "./Advertise.css";

const Advertise = () => {
  return (
    <div className="ads-page">
      <h1>Advertise & Support Us</h1>

      {/* Section: About */}
      <section className="ads-section">
        <h2>Why Advertise With Us?</h2>
        <p>
          This project is built for educational purposes only.  
          We aim to provide a Reddit-like platform to practice modern web
          development concepts.
        </p>
      </section>

      {/* Section: Advertising */}
      <section className="ads-section">
        <h2>Advertising</h2>
        <p>
          If you would like to promote your product, service, or community,
          feel free to contact us.
        </p>

        <ul>
          <li>✔ Tech-related content</li>
          <li>✔ Student communities</li>
          <li>✔ Educational platforms</li>
        </ul>

        <p className="ads-note">
          Note: We do not allow misleading or harmful advertisements.
        </p>
      </section>

      {/* Section: Donation */}
      <section className="ads-section donation">
        <h2>Support the Project ❤️</h2>
        <p>
          If you like this project and want to support its development,
          you can donate using InstaPay.
        </p>

        <div className="donation-box">
          <span>InstaPay Number</span>
          <strong>01108523630</strong>
        </div>

        <p className="ads-note">
          Donations are optional and help us improve the project.
        </p>
      </section>
    </div>
  );
};

export default Advertise;
