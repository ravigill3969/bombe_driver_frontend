function useUserAllowLocationPermission() {
  function handlePermission() {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted") {
        return "granted";
      } else if (result.state === "prompt") {
        return "prompt";
      } else if (result.state === "denied") {
        return "denied";
      }
    });
  }

  return handlePermission();
}

export default useUserAllowLocationPermission;
