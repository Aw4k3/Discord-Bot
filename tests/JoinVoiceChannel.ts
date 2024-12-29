(async () => {
  const response = await fetch("http://localhost:8080/joinvoicechannel", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      voiceChannelId: "855390674840191016",
    }),
  });
  const data = await response.json();
  console.log(data);
})();
