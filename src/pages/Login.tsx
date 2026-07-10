function Login() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          width: "380px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#0f172a" }}>
          AQUANTIS GLOBAL
        </h1>

        <p style={{ textAlign: "center", color: "#666" }}>
          Industrial Intelligence Platform
        </p>

        <input
          type="text"
          placeholder="Username"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
          }}
        />

        <button
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default Login;