import React, { useState } from "react";
import Login from "./Login";

const Trylogin = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const closeAll = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
    setIsResetOpen(false);
  };

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <button
          style={{ padding: "10px 20px", fontSize: "16px" }}
          onClick={() => setIsLoginOpen(true)}
        >
          Try Login Modal
        </button>

        {/* Modal */}
        {isLoginOpen && <Login setOpen={setIsLoginOpen} />}
      </div>
    </>
  );
};

export default Trylogin;
