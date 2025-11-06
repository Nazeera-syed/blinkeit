


const fetchUserDetails = async (idToken) => {
  try {
    const response = await fetch("http://localhost:8080/api/user/user-details", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`, // ✅ now uses passed token
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch user details failed:", error);
    return null;
  }
};

export default fetchUserDetails;
