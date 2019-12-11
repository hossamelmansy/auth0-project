import React, { useState, useEffect } from "react";
import { Button } from "@chakra-ui/core";
import Auth0Lock from "auth0-lock";
import axios from "axios";
import "./App.css";

const API_URL = ""; // API Gateway URL here
const AUTH0_CLIENT_ID = ""; // Auth0 client ID
const AUTH0_DOMAIN = ""; // Auth0 Domain

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [lock, setLock] = useState(null);
  const [response, setResponse] = useState("");

  useEffect(() => {
    loadFromLocalStorageToState();

    const lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
      auth: {
        audience: API_URL,
        params: {
          scope: "openid profile email"
        },
        responseType: "token"
      }
    });

    lock.on("authenticated", function({ accessToken }) {
      lock.getProfile(accessToken, function(error, profile) {
        setLocalStorage({
          accessToken: accessToken,
          profile: JSON.stringify(profile)
        });

        setAccessToken(accessToken);
        setProfile(profile);
      });
    });

    setLock(lock);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {renderContent()}
        <br />
        <br />
        <div>
          <Button variantColor="teal" onClick={onHelloClick}>
            Hello?
          </Button>
          <p>{`Response: ${response}`}</p>
        </div>
      </header>
    </div>
  );

  // ##########################################
  function renderContent() {
    if (accessToken && profile) {
      return (
        <div>
          <p>{`${profile.name} is logged in.`}</p>
          <Button variantColor="teal" onClick={onLogoutClick}>
            Logout
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <p>{`User is not logged in.`}</p>
          <Button variantColor="teal" onClick={onLoginClick}>
            Login
          </Button>
        </div>
      );
    }
  }

  async function onHelloClick() {
    try {
      const response = await axios.get("/hello", {
        baseURL: API_URL,
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : null
        }
      });

      setResponse(response.data.message);
    } catch (err) {
      setResponse("Error!");
    }
  }

  function onLoginClick() {
    lock.show();
  }

  function onLogoutClick() {
    clearLocalStorage(["accessToken", "profile"]);

    setAccessToken(null);
    setProfile(null);
  }

  function clearLocalStorage(keys = []) {
    for (let key of keys) {
      localStorage.removeItem(key);
    }
  }

  function setLocalStorage(items = {}) {
    for (let key in items) {
      localStorage.setItem(key, items[key]);
    }
  }

  function loadFromLocalStorageToState() {
    const accessToken = localStorage.getItem("accessToken");
    const profile = localStorage.getItem("profile");

    if (accessToken && profile) {
      setAccessToken(accessToken);
      setProfile(JSON.parse(profile));
    }
  }
}

export default App;
