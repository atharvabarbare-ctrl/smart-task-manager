import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await API.post("/auth/register", data);

      login({
        ...response.data.user,
        token: response.data.token,
      });

      toast.success(response.data.message);

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">

        <h1 className="text-3xl font-bold text-center mb-6 text-green-600">
          Register
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Name"
            {...register("name", {
              required: "Name is required",
            })}
            className="w-full border p-3 rounded-lg"
          />

          {errors.name && (
            <p className="text-red-500 text-sm">
              {errors.name.message}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
            })}
            className="w-full border p-3 rounded-lg"
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
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            })}
            className="w-full border p-3 rounded-lg"
          />

          {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            Register
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Register;