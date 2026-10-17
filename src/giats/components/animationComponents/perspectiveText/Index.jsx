import Link from 'next/link';
import clsx from 'clsx';
import styles from '@src/components/animationComponents/perspectiveText/perspectiveText.module.scss';

function PerspectiveText({ label, label2 = undefined, className = undefined, href = undefined, alignItems = 'center' }) {
  const alignmentClass = styles[`align-${alignItems}`] || styles.alignCenter;

  const renderContent = () => {
    if (href) {
      return (
        <>
          <Link scroll={false} href={href} aria-label={`Navigate to ${label}`}>
            {label}
          </Link>
          <Link scroll={false} href={href} aria-label={`Navigate to ${label2 || label}`}>
            {label2 || label}
          </Link>
        </>
      );
    }
    return (
      <>
        <p>{label}</p>
        <p>{label2 || label}</p>
      </>
    );
  };

  return (
    <div className={styles.root}>
      <div className={clsx(alignmentClass, className === null ? styles.perspectiveText : clsx(className || 'p-s', styles.perspectiveText))}>{renderContent()}</div>
    </div>
  );
}

export default PerspectiveText;
