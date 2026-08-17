import './Field.css';

export default function Field({ label, error, leadingIcon, trailingIcon, ...inputProps }) {
  return (
    <label className="tg-field">
      <span className="tg-field__label">{label}</span>
      <span className={`tg-field__control ${leadingIcon ? 'tg-field__control--leading' : ''} ${trailingIcon ? 'tg-field__control--trailing' : ''}`}>
        {leadingIcon ? <span className="tg-field__icon tg-field__icon--leading">{leadingIcon}</span> : null}
        <input className={`tg-field__input ${error ? 'tg-field__input--error' : ''}`} {...inputProps} />
        {trailingIcon ? <span className="tg-field__icon tg-field__icon--trailing">{trailingIcon}</span> : null}
      </span>
      {error && <span className="tg-field__error">{error}</span>}
    </label>
  );
}
