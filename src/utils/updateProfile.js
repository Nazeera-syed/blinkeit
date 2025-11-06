// utils/updateProfile.js
const updateProfile = async (idToken, profileData) => {
  try {
    const response = await fetch("http://localhost:8080/api/user/update-user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update profile failed:", error);
    return null;
  }
};

export default updateProfile;
