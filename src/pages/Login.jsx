import { useState } from 'react';
import { supabase } from '../lib/supabase';

const ADMIN_USER = {
  id: 'admin-hardcoded',
  email: 'admin@smartshop.com',
  role: 'admin',
  name: 'Admin',
};

export default function Login({ onAdminLogin, navigate }) {
  const [mode, setMode]           = useState('login');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [name, setName]           = useState('');
  const [error, setError]         = useState('');
  const [info, setInfo]           = useState('');
  const [loading, setLoading]     = useState(false);

  const clear = () => { setError(''); setInfo(''); };

  const handleGoogle = async () => {
    clear();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
  };

  const handleSiteAuth = async (e) => {
    e.preventDefault();
    clear();
    setLoading(true);
    try {
      if (mode === 'login' && email === 'admin' && password === 'admin') {
        onAdminLogin();
        return;
      }
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo('Check your email to confirm your account, then log in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">

        <div className="login-brand">Smart<span>Shop</span></div>
        <p className="login-tagline">Sign in to your account</p>

        <button className="login-google-btn" onClick={handleGoogle}>
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="login-or">
          <span className="login-or-line" />
          <span className="login-or-text">or</span>
          <span className="login-or-line" />
        </div>

        <div className="login-modetabs">
          <button
            className={`login-modetab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); clear(); }}
          >
            Log in
          </button>
          <button
            className={`login-modetab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); clear(); }}
          >
            Sign up
          </button>
        </div>

        {error && <div className="login-errmsg">{error}</div>}
        {info  && <div className="login-infomsg">{info}</div>}

        <form onSubmit={handleSiteAuth}>
          {mode === 'signup' && (
            <div className="form-field">
              <label>FULL NAME</label>
              <input
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div className="form-field">
            <label>EMAIL</label>
            <input
              type={mode === 'signup' ? 'email' : 'text'}
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>PASSWORD</label>
            <input
              type="password"
              placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={mode === 'signup' ? 6 : undefined}
            />
          </div>
          <button className="login-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        <p className="login-footer-note">
          By continuing you agree to our Terms &amp; Privacy Policy
        </p>

      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.7-2.9-11.2-7.1l-6.5 5C9.7 39.7 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.5l6.2 5.2C41.4 35.3 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
    </svg>
  );
}