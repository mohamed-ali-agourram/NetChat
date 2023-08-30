const Skeleton = () => {
  const numItems = 4

  return (
    <ul className="flex flex-col gap-2">
      {Array.from({ length: numItems }, (_, index) => (
        <li
          key={index}
          className="flex gap-2 items-center justify-start bg-opacity-20 bg-black p-2 rounded-2xl cursor-pointer h-[9vh]"
        ></li>
      ))}
    </ul>
  );
};

export default Skeleton;
