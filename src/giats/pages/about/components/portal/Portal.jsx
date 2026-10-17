import { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const FADE_OUT_DURATION = 450;

function Portal({ children, fadeIn, container }) {
  const [isVisible, setIsVisible] = useState(true);
  const fadeTimerRef = useRef(null);

  const handleVisibility = () => {
    if (fadeIn) {
      clearTimeout(fadeTimerRef.current);
      if (!isVisible) setIsVisible(true);
    } else {
      fadeTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, FADE_OUT_DURATION);
    }
  };

  useEffect(() => {
    handleVisibility();

    return () => clearTimeout(fadeTimerRef.current);
  }, [fadeIn]);

  if (!isVisible) return null;

  const portalContainer = typeof window !== 'undefined' ? container || document.body : null;

  return portalContainer ? ReactDOM.createPortal(children, portalContainer) : null;
}

Portal.propTypes = {
  children: PropTypes.node.isRequired,
  fadeIn: PropTypes.bool.isRequired,
  container: typeof window !== 'undefined' ? PropTypes.instanceOf(Element) : PropTypes.any,
};

Portal.defaultProps = {
  container: typeof window !== 'undefined' ? document.body : null,
};

export default Portal;
