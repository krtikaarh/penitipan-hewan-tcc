// update
import { useAuthContext } from "../auth/AuthProvider"
import { Navigate } from "react-router-dom"
import PropTypes from "prop-types"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext()

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Render children if authenticated
  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute
