import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Central Router Contexts
const RouterContext = createContext(null);
const OutletContext = createContext(null);
const ParamsContext = createContext({});

const normalizePath = (p) => {
  if (!p) return '';
  let res = p.trim();
  if (!res.startsWith('/')) res = '/' + res;
  res = res.replace(/\/+$/, '');
  return res || '/';
};

export const BrowserRouter = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(
    () => normalizePath(window.location.pathname) || '/'
  );
  const [historyState, setHistoryState] = useState(
    () => window.history.state || {}
  );

  useEffect(() => {
    const handlePopState = (event) => {
      setCurrentPath(normalizePath(window.location.pathname) || '/');
      setHistoryState(event.state || {});
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to, options = {}) => {
    if (typeof to === 'number') {
      window.history.go(to);
      return;
    }

    const { replace = false, state = {} } = options;
    const targetPath = normalizePath(to.split('?')[0]);

    if (replace) {
      window.history.replaceState(state, '', to);
    } else {
      window.history.pushState(state, '', to);
    }

    setCurrentPath(targetPath);
    setHistoryState(state);
  };

  const location = useMemo(() => {
    return {
      pathname: currentPath,
      search: window.location.search || '',
      hash: window.location.hash || '',
      state: historyState,
    };
  }, [currentPath, historyState]);

  return (
    <RouterContext.Provider value={{ location, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    return {
      pathname: normalizePath(window.location.pathname),
      search: window.location.search || '',
      hash: window.location.hash || '',
      state: {},
    };
  }
  return ctx.location;
};

export const useNavigate = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    return (to, options) => {
      if (options?.replace) window.location.replace(to);
      else window.location.href = to;
    };
  }
  return ctx.navigate;
};

export const useParams = () => {
  return useContext(ParamsContext) || {};
};

export const useSearchParams = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const setSearchParams = (newParams) => {
    const searchString = newParams.toString();
    navigate(`${location.pathname}?${searchString}`, { replace: true });
  };

  return [searchParams, setSearchParams];
};

export const Link = ({ to, children, className = '', onClick, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

export const NavLink = ({ to, children, className, onClick, end = false, ...props }) => {
  const location = useLocation();
  const current = normalizePath(location.pathname).toLowerCase();
  const target = normalizePath(to).toLowerCase();

  const isActive = end
    ? current === target
    : current === target || (target !== '/' && current.startsWith(target));

  const resolvedClass =
    typeof className === 'function' ? className({ isActive }) : className || '';

  return (
    <Link to={to} className={resolvedClass} onClick={onClick} {...props}>
      {children}
    </Link>
  );
};

export const Navigate = ({ to, replace = true, state }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace, state });
  }, [to, replace, state, navigate]);

  return null;
};

export const Outlet = () => {
  const outlet = useContext(OutletContext);
  return outlet || null;
};

// Route placeholder component
export const Route = () => null;

// Route matching and rendering engine supporting arbitrary nesting, pathless layouts, and outlets
export const Routes = ({ children }) => {
  const location = useLocation();
  const currentPath = normalizePath(location.pathname) || '/';

  const routesArray = React.Children.toArray(children);

  let notFoundElement = null;

  const matchNode = (routeNode, parentPath = '') => {
    if (!React.isValidElement(routeNode)) return null;

    const { path, element, index, children: nestedChildren } = routeNode.props;

    // Check catch-all
    if (path === '*') {
      notFoundElement = element;
      return null;
    }

    const isPathless = typeof path !== 'string';

    let fullPath = parentPath;
    if (!isPathless) {
      if (path.startsWith('/')) {
        fullPath = normalizePath(path);
      } else {
        fullPath = normalizePath(`${parentPath}/${path}`);
      }
    }

    // Index route matching
    if (index) {
      const targetPath = normalizePath(parentPath) || '/';
      if (currentPath === targetPath) {
        return { element, matched: true };
      }
      return null;
    }

    // Layout / Parent Route with nested children
    if (nestedChildren) {
      const childArray = React.Children.toArray(nestedChildren);

      // Check if currentPath can belong to this route or its children
      let isCandidate = false;
      if (isPathless) {
        // Pathless layout (e.g. ProtectedRoute) matches any child
        isCandidate = true;
      } else {
        const normFullPath = normalizePath(fullPath);
        if (normFullPath === '/') {
          isCandidate = true;
        } else if (currentPath === normFullPath || currentPath.startsWith(normFullPath + '/')) {
          isCandidate = true;
        }
      }

      if (isCandidate) {
        const nextParent = isPathless ? parentPath : fullPath;

        for (const child of childArray) {
          const childResult = matchNode(child, nextParent);
          if (childResult && childResult.matched) {
            const combined = element ? (
              <OutletContext.Provider value={childResult.element}>
                {element}
              </OutletContext.Provider>
            ) : (
              childResult.element
            );
            return { element: combined, matched: true };
          }
        }

        // Direct match on layout route if no child matched and path matches exactly
        if (!isPathless && currentPath === normalizePath(fullPath) && element) {
          return { element, matched: true };
        }
      }

      return null;
    }

    // Leaf route
    if (!isPathless) {
      const targetPath = normalizePath(fullPath);
      if (currentPath === targetPath) {
        return { element, matched: true };
      }
    }

    return null;
  };

  for (const route of routesArray) {
    const res = matchNode(route);
    if (res && res.matched) {
      return res.element;
    }
  }

  return notFoundElement || null;
};

export default {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
};
