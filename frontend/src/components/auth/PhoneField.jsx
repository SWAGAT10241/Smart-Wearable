import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function PhoneField({
  label,
  name,
  value,
  onChange,
  placeholder = "Enter phone number",
  defaultCountry = "IN",
  required = false,
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label
          htmlFor={name}
          className="text-[13px] font-medium text-[var(--color-text)]"
        >
          {label}
        </label>
      )}

      <div className="tg-phone-field">
        <PhoneInput
          id={name}
          international
          withCountryCallingCode
          defaultCountry={defaultCountry}
          countryCallingCodeEditable={false}
          value={value || undefined}
          onChange={(phone) =>
            onChange({
              target: {
                name,
                value: phone || "",
              },
            })
          }
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
}