interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  skin?: "default" | "primary";
}

export default function Button({
  skin = "default",
  children,
  onClick,
}: ButtonProps) {
  return (
    <button className="btn" onClick={onClick}>
      {children}
    </button>
  );
}
