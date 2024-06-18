import React from 'react';
import styled from 'styled-components';

const Login = () => {
  const clientId = '985f75e1c7464f97b9e03d426fcb1594';
  const redirectUri = 'http://localhost:5173/home';

  const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(values, x => possible[x % possible.length]).join('');
  };

  const codeVerifier = generateRandomString(64);

  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
  };

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const authenticate = async () => {
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    const scope = 'user-read-private user-read-email';
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    window.localStorage.setItem('code_verifier', codeVerifier);

    const params = {
      response_type: 'code',
      client_id: clientId,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  };

  return (
    <Container>
      <div className="body_login">
        <img src="https://s1.elespanol.com/2023/06/20/actualidad/772933347_234102709_1706x960.jpg" alt="spotify" className="spotify" />
        <img src="https://media4.giphy.com/media/982IAsALsL68kvVUDJ/200w.gif?cid=82a1493bwueyw5unt1iauf2bfj4uvw8kdsc2jsyc0pt0mmfh&ep=v1_gifs_related&rid=200w.gif&ct=g" alt="gif" />
        <button onClick={authenticate} className="login_btn">Login with Spotify</button>
      </div>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  .body_login {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .spotify {
    width: 300px;
    cursor: pointer;
    &:hover {
      width: 310px;
    }
  }

  .login_btn {
    font-size: 30px;
    margin-top: 80px;
    background: #1ed760;
    border: none;
    color: white;
    cursor: pointer;

    &:hover {
      font-size: 32px;
      margin-top: 82px;
      background: #1ef780;
    }
  }
`;
