import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/login");
  }
  return (
    <div className="w-full px-4 py-4 flex flex-col gap-2 items-center justify-center  mt-20">
      <h1 className="p-4 text-center text-[40px] text-stone-500">
        <span>Welcome to </span>
        <span className="text-blue-400 text-10xl">Internshala Automation</span>
      </h1>
      <button
        onClick={handleClick}
        className="text-blue-100 text-xl font-sm bg-blue-400 px-12 py-2 hover:bg-blue-500 hover:text-blue-100 transition-colors duration-200 rounded-sm"
      >
        Let's start
      </button>

      <p className="text-sm text-stone-600 text-center w-[600px] p-4">
        <i>
          Tired of filling out the same job application forms repeatedly?
          Internshala Automation simplifies your job hunt by auto-filling
          applications with just one click. Apply to multiple internships
          effortlessly and save time for what truly matters—your career!
        </i>
      </p>
    </div>
  );
}
