const Logout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    window.location.href = '/auth'; // Redirect to auth page
    return null; // Return null to avoid rendering any additional content
};

export default Logout;
