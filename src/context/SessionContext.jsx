import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('username');
    const savedRole = localStorage.getItem('role');
    return savedUser ? { username: savedUser, role: savedRole } : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('username', user.username);
      localStorage.setItem('role', user.role);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('role');
    }
  }, [user]);

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      {children}
    </SessionContext.Provider>
  );
}

// Define prop types
SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useSession() {
  return useContext(SessionContext);
}
