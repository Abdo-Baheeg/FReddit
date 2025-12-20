import React from "react";

const Help = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>oooh ! Need Help?</h1>

      <p style={styles.text}>
        If you need any help or have a question about this project,
        feel free to contact me anytime.
      </p>

      <div style={styles.card}>
        <p style={styles.emailText}>Contact me on linkedin:</p>
        <a
          href="https://www.linkedin.com/in/ahmedmo2511/"
          style={styles.email}
        >
          My linkedIn Profile
        </a>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    backgroundColor: "var(--reddit-bg)",
    color: "var(--reddit-text-primary)",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "var(--reddit-text-primary)",
    marginBottom: "10px",
  },
  text: {
    fontSize: "16px",
    color: "var(--reddit-text-secondary)",
    marginBottom: "25px",
    textAlign: "center",
    maxWidth: "500px",
  },
  card: {
    background: "var(--reddit-card-bg)",
    color: "var(--reddit-text-primary)",
    padding: "20px 30px",
    borderRadius: "12px",
    boxShadow: "var(--shadow-md)",
    border: "1px solid var(--reddit-border)",
    textAlign: "center",
    transition: "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
  },
  emailText: {
    marginBottom: "8px",
    color: "var(--reddit-text-secondary)",
  },
  email: {
    color: "var(--reddit-orange)",
    fontWeight: "600",
    textDecoration: "none",
    fontSize: "16px",
    transition: "color 0.3s ease",
  },
};

export default Help;
