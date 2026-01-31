// Responsive design utilities

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280
};

export const useMediaQuery = (query) => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};

export const useIsMobile = () => {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.mobile}px)`);
};

export const useIsTablet = () => {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.tablet}px)`);
};

export const useIsDesktop = () => {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.desktop}px)`);
};

export const MobileMenu = ({ items, isOpen, onClose }) => {
  return (
    <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <div className="mobile-menu-overlay" onClick={onClose} />
      <div className="mobile-menu-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <nav>
          {items.map((item, index) => (
            <a key={index} href={item.href} onClick={onClose}>
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export const ResponsiveTable = ({ data, columns, mobileCard }) => {
  const isMobile = useIsMobile();

  if (isMobile && mobileCard) {
    return (
      <div className="mobile-cards">
        {data.map((row, index) => mobileCard(row, index))}
      </div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col, i) => <th key={i}>{col.header}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col, j) => <td key={j}>{col.render(row)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
