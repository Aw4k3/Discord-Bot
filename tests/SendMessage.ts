(async () => {
  const response = await fetch("http://localhost:8080/sendmessage", {
    method: "POST",
    body: JSON.stringify({
      textChannelId: "706098244081680385",
      message: "API Test",
    }),
  });
  const data = await response.json();
  console.log(data);
})();
