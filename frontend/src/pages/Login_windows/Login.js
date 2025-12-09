import React, { useState } from "react";
import "./Login.css";
import Signup from "./Signup.js";
import Reset from "./Reset.js";
import Emailme from "./Emailme.js";
import {
  Logintitle,
  Loginparagraph,
  Loginlink,
  ContinueWithLink,
  ContinueWithWindow,
  OR,
  InputText,
  Submit,
  CloseButton,
  LoginMover,
} from "./components.js";

const Login = ({ setOpen }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Both are Empty → disabled
  const disabled = username.trim() === "" || password.trim() === "";

  // Modals State
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isEmailmeOpen, setIsEmailmeOpen] = useState(false);

  return (
    <div className="All_login">
      <div className="login-container">
        <div className="login-overlay" onClick={() => setOpen(false)}>
          <div className="login-notclose" onClick={(e) => e.stopPropagation()}>
            <div className="my-window-close-button">
              <CloseButton onClose={() => setOpen(false)} />
            </div>

            <div className="logintile">
              <Logintitle text="Log In" />
            </div>

            <div className="paragraphs">
              <Loginparagraph text="By continuing, you agree to our " />
              <Loginlink
                href="https://redditinc.com/policies/user-agreement"
                data="User Agreement"
              />
              <Loginparagraph text=" and " />
              <br></br>
              <Loginparagraph text="acknowledge that you understand the " />
              <Loginlink
                href="https://redditinc.com/policies/privacy-policy"
                data="Privacy Policy"
              />
              <Loginparagraph text=" ." />
            </div>

            <div className="continues">
              <ContinueWithLink
                text="Continue with Phone Number"
                icon="/icons/login/phonenumber.svg"
              />
              <ContinueWithLink
                text="Continue with Google"
                icon="/icons/login/google.svg"
                link="https://accounts.google.com/v3/signin/accountchooser?as=-UqAZMzlOURYuIt0e02VRTSt7FsWyfeEYipnkoqW1Bw&client_id=705819728788-b2c1kcs7tst3b7ghv7at0hkqmtc68ckl.apps.googleusercontent.com&display=popup&gis_params=ChZodHRwczovL3d3dy5yZWRkaXQuY29tEg1naXNfdHJhbnNmb3JtGAcqKy1VcUFaTXpsT1VSWXVJdDBlMDJWUlRTdDdGc1d5ZmVFWWlwbmtvcVcxQncySDcwNTgxOTcyODc4OC1iMmMxa2NzN3RzdDNiN2dodjdhdDBoa3FtdGM2OGNrbC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbTgBQkBkNjU0NjJjMWM1MGI0YWE1NDFmMTUxNjZkMjU2MDZlZGRkZDkwMTE1M2Q2OGJhOWFiOTQxNmE5Mjk3ODBlNjRjUkFhdXRoLWZsb3ctc3NvLWJ1dHRvbnMtZ29vZ2xlLTUyNWY4MWYzLTg4MzgtNDMxNS05NzhiLThmMjllMTRiYjIyMw&gsiwebsdk=gis_attributes&origin=https%3A%2F%2Fwww.reddit.com&prompt=select_account&redirect_uri=gis_transform&response_mode=form_post&response_type=id_token&scope=openid+email+profile&state=auth-flow-sso-buttons-google-525f81f3-8838-4315-978b-8f29e14bb223&dsh=-UqAZMzlOURYuIt0e02VRTSt7FsWyfeEYipnkoqW1Bw&o2v=1&service=lso&flowName=GeneralOAuthFlow&opparams=%253Fgis_params%253DChZodHRwczovL3d3dy5yZWRkaXQuY29tEg1naXNfdHJhbnNmb3JtGAcqKy1VcUFaTXpsT1VSWXVJdDBlMDJWUlRTdDdGc1d5ZmVFWWlwbmtvcVcxQncySDcwNTgxOTcyODc4OC1iMmMxa2NzN3RzdDNiN2dodjdhdDBoa3FtdGM2OGNrbC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbTgBQkBkNjU0NjJjMWM1MGI0YWE1NDFmMTUxNjZkMjU2MDZlZGRkZDkwMTE1M2Q2OGJhOWFiOTQxNmE5Mjk3ODBlNjRjUkFhdXRoLWZsb3ctc3NvLWJ1dHRvbnMtZ29vZ2xlLTUyNWY4MWYzLTg4MzgtNDMxNS05NzhiLThmMjllMTRiYjIyMw%2526response_mode%253Dform_post&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAOtNLEp2S9h2uBrKseTbCBvX42QqA5eXO7mgwxPoNcd6Cgpx8d3yAmsFFijIKQtVPCCs0U_oXBnkVnqWT85VZGJ99ksiIDJHD814Xr8FeBoox-_in0hJI9fY7oa2S1R3Ne-3vNCM5uT2Eb_KfQwc0N_9CEogtlOzptbgDcz0IVWwlaGaINY_OUE6JUrx8sKNdslqCRodOYm6nBdXlKMTJX2TUALa8UaW-28p0i4Phl48fIKGyG-O4a3nN31F3JakkZjKPEzHguDbuYkisIEO6-rpzFsoDQWZSWT5kZ20MAyIIdSIpQ8yNEtFPn6lpCuAivt3x1X74VhFo3H38wi4Nl8P9OrdGM8FWRbhncRUQXPfBRfZlP4QFlIAEkGBUmZh1jsR4A9OnwPfnVkT-S-j6EzXpg6q2NKLGKoXuw9p2TfyTfnTvB5QJJ2Q_hyxFy8ulhQBmRId_HoV_d2OhtbDj467rLcJ1VOWs5xRixoX4ddmXXvnWU%26flowName%3DGeneralOAuthFlow%26as%3D-UqAZMzlOURYuIt0e02VRTSt7FsWyfeEYipnkoqW1Bw%26client_id%3D705819728788-b2c1kcs7tst3b7ghv7at0hkqmtc68ckl.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fwww.reddit.com"
              />
              <ContinueWithLink
                text="Continue with Apple"
                icon="/icons/login/apple.svg"
                link="https://appleid.apple.com/auth/authorize?client_id=com.reddit.RedditAppleSSO&redirect_uri=https%3A%2F%2Fwww.reddit.com&response_type=code%20id_token&state=5efe843f4ceeb157a1c238b07a0a6b38&scope=email&response_mode=web_message&frame_id=5956142b-63b0-4bf7-8ead-57322a0c3522&m=12&v=1.5.6"
              />
              <ContinueWithWindow
                text="Email me with a one-time link"
                icon="/icons/login/email.svg"
                onOpen={() => setIsEmailmeOpen(true)}
              />
              {isEmailmeOpen && <Emailme setOpen={setIsEmailmeOpen} />}
            </div>

            <div className="OR">
              <OR />
            </div>

            <div className="inputs">
              <InputText
                label="Email or username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <InputText
                label="Password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="forgot?">
              <LoginMover
                data="Forgot password?"
                onOpen={() => setIsResetOpen(true)}
              />
              {isResetOpen && <Reset setOpen={setIsResetOpen} />}
            </div>

            <div className="forgot?">
              <Loginparagraph text="New to Reddit? " />
              <LoginMover data="Sign Up" onOpen={() => setIsSignupOpen(true)} />
              {isSignupOpen && <Signup setOpen={setIsSignupOpen} />}
            </div>
            <div className="submits">
              <Submit text="Log In" disabled={disabled} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
