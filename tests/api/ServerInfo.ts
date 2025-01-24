(async () => {
  const response = await fetch("http://localhost:8080/serverinfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      serverId: "436914784676610078",
    }),
  });
  const data = await response.json();
  console.log(data);
})();
