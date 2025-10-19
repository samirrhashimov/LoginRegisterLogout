import { useFormik } from "formik";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const baseUrl = "http://localhost:3000/users";
  let navigate = useNavigate();

  const [users, setUsers] = useState([]);

  let getUsers = async () => {
    try {
      let { data } = await axios(baseUrl);
      setUsers(data);
    } catch (e) {
      console.error("Failed to fetch users", e);
      toast.error("Cannot reach server. Please start the backend at http://localhost:3000");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const { values, handleChange, handleSubmit, resetForm, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      let { username, password } = values;

      let existUser = users.find(
        (user) => user.username == username && user.password == password
      );

      if (existUser) {
        try {
          await axios.put(`${baseUrl}/${existUser.id}`, {
            ...existUser,
            isLogined: true,
          });
        } catch (e) {
          console.error("Failed to update login on server", e);
          toast.error("Warning: could not update login state on server. Proceeding locally.");
        }
        // persist current user to localStorage for UI state
        try {
          localStorage.setItem("currentUser", JSON.stringify({
            ...existUser,
            isLogined: true,
          }));
        } catch (e) {
          console.error("localStorage set failed", e);
        }
        toast.success("User login sucsess");
        resetForm();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error("username or password wrong");
        resetForm();
      }
  },
  });

  let { username, password } = values;

  return (
    <div className="login-container">
      <form className="login-form" action="" onSubmit={handleSubmit}>
        <h2>Login</h2>
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
        <button className="login-btn" type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
