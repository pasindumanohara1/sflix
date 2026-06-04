import { useLogin } from '@/context/LoginContext';

export default function LoginModal() {
  const { isOpen, close } = useLogin();

  if (!isOpen) return null;

  return (
    <>
      <div className="login-overlay" onClick={close} />
      <div className="login-modal">
        <div className="login-modal-header">
          <h3>Login</h3>
          <button className="login-modal-close" onClick={close} aria-label="Close">
            <i className="fas fa-times" />
          </button>
        </div>
        <form className="login-modal-body" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="login-email">Username or Email</label>
            <input
              id="login-email"
              type="text"
              className="login-input"
              placeholder="Enter username or email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="login-input"
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="login-submit">Login</button>
          <p className="login-hint">Don't have an account? <a href="#">Sign up</a></p>
        </form>
      </div>

      <style>{`
        .login-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          z-index: 2000;
        }

        .login-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--bg-secondary);
          border-radius: 8px;
          z-index: 2001;
          width: 400px;
          max-width: 90vw;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }

        .login-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--bg-tertiary);
        }

        .login-modal-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .login-modal-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0.25rem;
        }

        .login-modal-close:hover {
          color: var(--text-primary);
        }

        .login-modal-body {
          padding: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.4rem;
        }

        .login-input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 6px;
          border: 1px solid var(--bg-tertiary);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.9rem;
          font-family: 'Montserrat', sans-serif;
          outline: none;
        }

        .login-input:focus {
          border-color: var(--accent-blue);
        }

        .login-submit {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 6px;
          background: var(--accent-blue);
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          margin-bottom: 0.75rem;
          transition: background 0.2s;
        }

        .login-submit:hover {
          background: #2563eb;
        }

        .login-hint {
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 0;
        }

        .login-hint a {
          color: var(--accent-blue);
        }
      `}</style>
    </>
  );
}
