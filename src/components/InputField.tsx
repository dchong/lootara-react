export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<any>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border p-2"
        {...rest} // ⬅️ spread remaining props
      />
    </div>
  );
}
