import './Button.css';

// variant: 'primary' (accent teal, matches Login/Register/"I'm okay" buttons)
//        | 'secondary' (white + border, matches "Continue with Google")
//        | 'danger' (alert red, matches "Send SOS now" / "Log out")
export default function Button({ variant = 'primary', children, ...props }) {
  const className = props.className ? `tg-btn tg-btn--${variant} ${props.className}` : `tg-btn tg-btn--${variant}`;
  return (
    <button {...props} className={className}>
      {children}
    </button>
  );
}
