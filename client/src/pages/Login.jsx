import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await API.post("/auth/login", data);

      login({
        ...response.data.user,
        token: response.data.token,
      });

      toast.success(response.data.message);

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Login
        </h1>


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
            })}
            className="w-full border p-3 rounded-lg outline-none"
          />

          {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email.message}
            </p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
            })}
            className="w-full border p-3 rounded-lg outline-none"
          />

          {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}

export default Login;

