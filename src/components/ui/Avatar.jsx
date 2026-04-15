const Avatar = ({ name = "User", size = 24 }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold`}
      style={{ width: size * 4, height: size * 4 }}
    >
      {initials}
    </div>
  );
};

export default Avatar;