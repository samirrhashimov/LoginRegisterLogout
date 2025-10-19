import { useFormik } from "formik";
import "./Register.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const baseUrl = "http://localhost:3000/users";

  let navigate = useNavigate();
  const [users, setUsers] = useState([]);

  let getUsers = async () => {
    try {
      let { data } = await axios(baseUrl);
      setUsers(data);
    } catch (e) {
      console.error("Failed to fetch users", e);
      // If backend is down, keep users empty and show a toast so user knows
      // but don't throw to avoid unhandled errors in useEffect.
      // The register submit will also show a helpful error.
      // toast is available in this module
      toast.error("Cannot reach server. Please start the backend at http://localhost:3000");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const { values, handleChange, handleSubmit, resetForm, errors } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      isLogined: false,
    },
    onSubmit: async (values) => {
      let { username, email } = values;

      let existUser = users.find(
        (user) => user.username == username || user.email == email
      );

      if (existUser) {
        toast.error("User already exist");
        return;
      }

      try {
        await axios.post("http://localhost:3000/users", values);
        toast.success("User register Succsess ");
        resetForm();
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (e) {
        console.error("Register failed", e);
        // Network errors (e.g., backend not running) show a friendly message
        if (e?.code === "ERR_NETWORK" || e?.message?.includes("Network Error")) {
          toast.error(
            "Network error: cannot reach server. Start the backend at http://localhost:3000"
          );
        } else {
          toast.error("Registration failed. Please try again.");
        }
      }
    },
  });

  let { firstName, lastName, username, email, password, confirmPassword } =
    values;

  return (
    <div className="register-container">
      <form className="register-form" action="" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div>
          <div className="label-container">
            <label htmlFor="firstName">Name</label>
            {errors.firstName ? (
              <span className="error">{errors.firstName}</span>
            ) : null}
          </div>
          <input
            type="text"
            id="firstName"
            onChange={handleChange}
            value={firstName}
            style={errors.firstName ? { borderColor: "red" } : null}
          />
        </div>
        <div>
          <div className="label-container">
            <label htmlFor="lastName">Surname</label>
            {errors.lastName ? (
              <span className="error">{errors.lastName}</span>
            ) : null}
          </div>
          <input
            type="text"
            id="lastName"
            onChange={handleChange}
            value={lastName}
            style={errors.lastName ? { borderColor: "red" } : null}
          />
        </div>
        <div>
          <div className="label-container">
            <label htmlFor="username">Username</label>
            {errors.username ? (
              <span className="error">{errors.username}</span>
            ) : null}
          </div>
          <input
            type="text"
            id="username"
            onChange={handleChange}
            value={username}
            style={errors.username ? { borderColor: "red" } : null}
          />
        </div>
        <div>
          <div className="label-container">
            <label htmlFor="email">Email</label>
            {errors.email ? (
              <span className="error">{errors.email}</span>
            ) : null}
          </div>
          <input
            type="email"
            id="email"
            onChange={handleChange}
            value={email}
            style={errors.email ? { borderColor: "red" } : null}
          />
        </div>
        <div>
          <div className="label-container">
            <label htmlFor="password">Password</label>
            {errors.password ? (
              <span className="error">{errors.password}</span>
            ) : null}
          </div>
          <input
            type="password"
            id="password"
            onChange={handleChange}
            value={password}
            style={errors.password ? { borderColor: "red" } : null}
          />
        </div>
        <div>
          <div className="label-container">
            <label htmlFor="confirmPassword">ConfirmPassword</label>
            {errors.confirmPassword ? (
              <span className="error">{errors.confirmPassword}</span>
            ) : null}
          </div>
          <input
            type="password"
            id="confirmPassword"
            onChange={handleChange}
            value={confirmPassword}
            style={errors.confirmPassword ? { borderColor: "red" } : null}
          />
        </div>
        <p style={{ padding: "5px 0 0" }}>
          Already have an account?
          <Link style={{ color: "aqua" }} to={"/login"}>
            Sign In
          </Link>
        </p>
        <button className="register-btn" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
